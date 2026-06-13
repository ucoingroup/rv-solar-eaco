part of 'charging_bloc.dart';

abstract class ChargingEvent extends Equatable {
  const ChargingEvent();
  
  @override
  List<Object?> get props => [];
}

class GetCurrentCharging extends ChargingEvent {}

class StartCharging extends ChargingEvent {
  final String chargerId;
  
  const StartCharging(this.chargerId);
  
  @override
  List<Object?> get props => [chargerId];
}

class StopCharging extends ChargingEvent {
  final String chargingId;
  
  const StopCharging(this.chargingId);
  
  @override
  List<Object?> get props => [chargingId];
}

class GetChargingHistory extends ChargingEvent {}