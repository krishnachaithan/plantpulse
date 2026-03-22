import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Time "mo:core/Time";
import List "mo:core/List";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Array "mo:core/Array";
import Int "mo:core/Int";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type HealthStatus = {
    #healthy;
    #mild;
    #moderate;
    #severe;
  };

  module HealthStatus {
    func toNat(status : HealthStatus) : Nat {
      switch (status) {
        case (#healthy) { 0 };
        case (#mild) { 1 };
        case (#moderate) { 2 };
        case (#severe) { 3 };
      };
    };

    public func compare(status1 : HealthStatus, status2 : HealthStatus) : Order.Order {
      Int.compare(toNat(status1), toNat(status2));
    };
  };

  public type DiagnosisResult = {
    timestamp : Time.Time;
    plantName : Text;
    healthStatus : HealthStatus;
    conditions : [Text];
    fertilizerRecommendations : [Text];
    pesticideRecommendations : [Text];
    careTips : [Text];
    image : ?Storage.ExternalBlob;
  };

  module DiagnosisResult {
    public func compareByDateDescending(result1 : DiagnosisResult, result2 : DiagnosisResult) : Order.Order {
      Int.compare(result2.timestamp, result1.timestamp);
    };
  };

  public type UserProfile = {
    name : Text;
  };

  public type UserWithDiagnoses = {
    user : Principal;
    profile : ?UserProfile;
    diagnoses : [DiagnosisResult];
  };

  let userHistories = Map.empty<Principal, List.List<DiagnosisResult>>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only owner or admin can view the profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func addDiagnosis(
    plantName : Text,
    healthStatus : HealthStatus,
    conditions : [Text],
    fertilizerRecommendations : [Text],
    pesticideRecommendations : [Text],
    careTips : [Text],
    image : ?Storage.ExternalBlob,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add diagnoses");
    };

    let newDiagnosis : DiagnosisResult = {
      timestamp = Time.now();
      plantName;
      healthStatus;
      conditions;
      fertilizerRecommendations;
      pesticideRecommendations;
      careTips;
      image;
    };

    let history = switch (userHistories.get(caller)) {
      case (null) { List.empty<DiagnosisResult>() };
      case (?existing) { existing };
    };

    history.add(newDiagnosis);

    userHistories.add(caller, history);
  };

  public query ({ caller }) func getDiagnosisHistory(target : Principal) : async [DiagnosisResult] {
    AssertAuthorizedForUser(caller, target, "get diagnosis history");
    let diagnosisHistory = switch (userHistories.get(target)) {
      case (null) { return [] };
      case (?history) { history };
    };
    diagnosisHistory.toArray().sort(DiagnosisResult.compareByDateDescending);
  };

  func AssertAuthorizedForUser(caller : Principal, target : Principal, action : Text) {
    if (not AccessControl.isAdmin(accessControlState, caller) and caller != target) {
      Runtime.trap("Unauthorized: Only owner or admin can " # action);
    };
  };

  public shared ({ caller }) func clearDiagnosisHistory(target : Principal) : async () {
    AssertAuthorizedForUser(caller, target, "clear diagnosis history");
    userHistories.remove(target);
  };

  public shared ({ caller }) func analyzePlantImage(image : Storage.ExternalBlob) : async DiagnosisResult {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can analyze plant images");
    };

    let emptyDiagnosis : DiagnosisResult = {
      timestamp = Time.now();
      plantName = "Unknown Plant";
      healthStatus = #healthy;
      conditions = [];
      fertilizerRecommendations = [];
      pesticideRecommendations = [];
      careTips = [];
      image = ?image;
    };

    await addDiagnosis(
      emptyDiagnosis.plantName,
      #healthy,
      [],
      [],
      [],
      [],
      ?image,
    );

    emptyDiagnosis;
  };

  func assertIsAdmin(caller : Principal, action : Text) {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can " # action);
    };
  };

  public query ({ caller }) func getAllUsers() : async [(Principal, UserProfile)] {
    assertIsAdmin(caller, "get all users");
    userProfiles.toArray();
  };

  public query ({ caller }) func getAllUsersDiagnoses() : async [UserWithDiagnoses] {
    assertIsAdmin(caller, "get all users' diagnoses");
    userHistories.toArray().map(
      func((user, diagnoses)) {
        let diagnosesArray = diagnoses.toArray();
        {
          user;
          profile = userProfiles.get(user);
          diagnoses = diagnosesArray;
        };
      }
    );
  };
};
