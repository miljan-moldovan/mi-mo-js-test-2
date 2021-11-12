export enum RoomType {
  NULL = 0,
  /// <summary> The Nothing value means that a room is not required in order
  // to book this service. </summary>
  Nothing = 1,
  /// <summary> The HalfRoom value means that a room is required,
  // but two services can be booked in the same room without overbooking.
  // This is typically used for couple"s massage and similar services. </summary>
  HalfRoom = 2,
  /// <summary> The FullRoom value means that a room is required,
  // and that only one service can be booked in a particular room. </summary>
  FullRoom = 3,
  /// <summary> The Various value is only used in the UI when presenting the
  // value of RequireRoom for multiple services together (category grouping).
  // This value should never be saved to the database and has no actual meaning. </summary>
  Various = 4
}
