import Map "mo:core/Map";
import Set "mo:core/Set";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Runtime "mo:core/Runtime";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  type TournamentId = Nat;
  type WalletLedgerId = Nat;

  type UserProfile = {
    var displayName : ?Text;
    var freeFireUid : ?Text;
    createdAt : Time.Time;
    var updatedAt : Time.Time;
  };

  type PublicFields = {
    displayName : ?Text;
    freeFireUid : ?Text;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  public type PublicUserProfileView = {
    displayName : ?Text;
    freeFireUid : ?Text;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  public type PublicUserProfileInput = {
    displayName : ?Text;
    freeFireUid : ?Text;
  };

  public type Tournament = {
    id : TournamentId;
    name : Text;
    entryFee : Nat;
    createdAt : Time.Time;
    startTime : Time.Time;
    maxParticipants : ?Nat;
  };

  public type TournamentEntry = { tournamentId : TournamentId };
  public type TournamentPayout = { tournamentId : TournamentId };
  public type CustomTransaction = { description : Text };

  public type WalletTransactionType = {
    #adminCredit : ();
    #tournamentEntry : TournamentEntry;
    #tournamentPayout : TournamentPayout;
    #custom : CustomTransaction;
  };

  public type WalletLedgerEntry = {
    id : WalletLedgerId;
    amount : Nat;
    transactionType : WalletTransactionType;
    createdAt : Time.Time;
  };

  public type PublicTournamentDetails = {
    name : Text;
    entryFee : Nat;
    createdAt : Time.Time;
    startTime : Time.Time;
    maxParticipants : ?Nat;
  };

  module Tournament {
    public func compareByStartTime(t1 : Tournament, t2 : Tournament) : Order.Order {
      Int.compare(toInt(t1.startTime), toInt(t2.startTime));
    };

    func toInt(time : Time.Time) : Int {
      time;
    };
  };

  // State
  var nextTournamentId = 1;
  var nextWalletLedgerId = 1;

  let tournaments = Map.empty<TournamentId, Tournament>();
  let userBalances = Map.empty<Principal, Nat>();
  let walletLedger = Map.empty<WalletLedgerId, WalletLedgerEntry>();
  let tournamentParticipants = Map.empty<TournamentId, Set.Set<Principal>>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Backend persistent storage
  public query ({ caller }) func getCallerUserProfile() : async ?PublicUserProfileView {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    switch (userProfiles.get(caller)) {
      case (?profile) {
        ?{
          displayName = profile.displayName;
          freeFireUid = profile.freeFireUid;
          createdAt = profile.createdAt;
          updatedAt = profile.updatedAt;
        };
      };
      case (null) { null };
    };
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?PublicUserProfileView {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    switch (userProfiles.get(user)) {
      case (?profile) {
        ?{
          displayName = profile.displayName;
          freeFireUid = profile.freeFireUid;
          createdAt = profile.createdAt;
          updatedAt = profile.updatedAt;
        };
      };
      case (null) { null };
    };
  };

  public shared ({ caller }) func saveCallerUserProfile(updatedProfile : PublicUserProfileInput) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };

    let currentTime = Time.now();
    let profile : UserProfile =
      switch (userProfiles.get(caller)) {
        case (?existingProfile) {
          {
            var displayName = updatedProfile.displayName;
            var freeFireUid = updatedProfile.freeFireUid;
            createdAt = existingProfile.createdAt;
            var updatedAt = currentTime;
          };
        };
        case (null) {
          {
            var displayName = updatedProfile.displayName;
            var freeFireUid = updatedProfile.freeFireUid;
            createdAt = currentTime;
            var updatedAt = currentTime;
          };
        };
      };
    userProfiles.add(caller, profile);
  };

  // Wallet functionality
  public query ({ caller }) func getCallerWalletBalance() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view wallet balance");
    };
    switch (userBalances.get(caller)) {
      case (null) { 0 };
      case (?balance) { balance };
    };
  };

  public query ({ caller }) func getUserWalletBalance(user : Principal) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view other users' wallet balances");
    };
    switch (userBalances.get(user)) {
      case (null) { 0 };
      case (?balance) { balance };
    };
  };

  public shared ({ caller }) func adminCreditWallet(user : Principal, amount : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can credit wallets");
    };

    let currentBalance = switch (userBalances.get(user)) {
      case (null) { 0 };
      case (?balance) { balance };
    };

    userBalances.add(user, currentBalance + amount);

    let transactionId = nextWalletLedgerId;
    nextWalletLedgerId += 1;

    let entry : WalletLedgerEntry = {
      id = transactionId;
      amount = amount;
      transactionType = #adminCredit(());
      createdAt = Time.now();
    };
    walletLedger.add(transactionId, entry);
  };

  // Tournament functionality
  private func validateUserProfile(caller : Principal) {
    switch (userProfiles.get(caller)) {
      case (null) {
        Runtime.trap("You must create a profile before joining a tournament");
      };
      case (?profile) {
        switch (profile.freeFireUid) {
          case (null) {
            Runtime.trap("You must set your Free Fire UID before joining a tournament");
          };
          case (?uid) {
            if (uid.size() == 0) {
              Runtime.trap("Free Fire UID cannot be empty");
            };
          };
        };
      };
    };
  };

  public shared ({ caller }) func joinTournament(tournamentId : TournamentId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can join tournaments");
    };

    validateUserProfile(caller);

    let tournament = switch (tournaments.get(tournamentId)) {
      case (null) { Runtime.trap("Tournament not found") };
      case (?tournament) { tournament };
    };

    let participants = switch (tournamentParticipants.get(tournamentId)) {
      case (null) { Set.empty<Principal>() };
      case (?existing) { existing };
    };

    if (participants.contains(caller)) {
      Runtime.trap("You have already joined this tournament");
    };

    switch (tournament.maxParticipants) {
      case (?max) {
        if (participants.size() >= max) {
          Runtime.trap("Tournament is full");
        };
      };
      case (null) {};
    };

    if (tournament.entryFee > 0) {
      let currentBalance = switch (userBalances.get(caller)) {
        case (null) { 0 };
        case (?balance) { balance };
      };

      if (currentBalance < tournament.entryFee) {
        Runtime.trap("Insufficient balance to join tournament");
      };

      userBalances.add(caller, currentBalance - tournament.entryFee);

      let transactionId = nextWalletLedgerId;
      nextWalletLedgerId += 1;

      let entry : WalletLedgerEntry = {
        id = transactionId;
        amount = tournament.entryFee;
        transactionType = #tournamentEntry({
          tournamentId = tournamentId;
        });
        createdAt = Time.now();
      };
      walletLedger.add(transactionId, entry);
    };

    participants.add(caller);
    tournamentParticipants.add(tournamentId, participants);
  };

  public query ({ caller }) func listTournaments() : async [PublicTournamentDetails] {
    let tournamentList = switch (tournaments.isEmpty()) {
      case (true) {
        [
          {
            name = "Tournament 1";
            entryFee = 1000;
            createdAt = Time.now();
            startTime = Time.now() + (3600 * 1000000000);
            maxParticipants = ?1000;
          },
        ];
      };
      case (false) {
        let values = tournaments.values().toArray();
        values.sort(Tournament.compareByStartTime).map(
          func(t) {
            {
              name = t.name;
              entryFee = t.entryFee;
              createdAt = t.createdAt;
              startTime = t.startTime;
              maxParticipants = t.maxParticipants;
            };
          }
        );
      };
    };
    tournamentList;
  };

  public query ({ caller }) func getTournamentDetails(tournamentId : TournamentId) : async PublicTournamentDetails {
    let tournament = switch (tournaments.get(tournamentId)) {
      case (null) { Runtime.trap("Tournament not found") };
      case (?t) { t };
    };
    {
      name = tournament.name;
      entryFee = tournament.entryFee;
      createdAt = tournament.createdAt;
      startTime = tournament.startTime;
      maxParticipants = tournament.maxParticipants;
    };
  };

  public shared ({ caller }) func adminCreateTournament(
    name : Text,
    entryFee : Nat,
    startTime : Time.Time,
    maxParticipants : ?Nat,
  ) : async TournamentId {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create tournaments");
    };

    let tournamentId = nextTournamentId;
    nextTournamentId += 1;

    let tournament : Tournament = {
      id = tournamentId;
      name = name;
      entryFee = entryFee;
      createdAt = Time.now();
      startTime = startTime;
      maxParticipants = maxParticipants;
    };

    tournaments.add(tournamentId, tournament);
    tournamentId;
  };
};
