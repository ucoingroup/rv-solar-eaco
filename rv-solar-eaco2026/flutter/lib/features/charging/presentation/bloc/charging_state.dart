part of 'charging_bloc.dart';

abstract class ChargingState extends Equatable {
  const ChargingState();
  
  @override
  List<Object?> get props => [];
}

class ChargingInitial extends ChargingState {}

class ChargingLoading extends ChargingState {}

class ChargingIdle extends ChargingState {}

class ChargingInProgress extends ChargingState {
  final String chargingId;
  final String chargerId;
  final double energyKwh;
  final double powerW;
  final double voltageV;
  final double currentA;
  
  const ChargingInProgress({
    required this.chargingId,
    required this.chargerId,
    required this.energyKwh,
    required this.powerW,
    required this.voltageV,
    required this.currentA,
  });
  
  @override
  List<Object?> get props => [chargingId, chargerId, energyKwh, powerW, voltageV, currentA];
}

class ChargingStarted extends ChargingState {
  final String chargingId;
  final double energyKwh;
  final double powerW;
  
  const ChargingStarted({
    required this.chargingId,
    required this.energyKwh,
    required this.powerW,
  });
  
  @override
  List<Object?> get props => [chargingId, energyKwh, powerW];
}

class ChargingStopped extends ChargingState {
  final double energyKwh;
  final int rewardEaco;
  final double carbonKg;
  
  const ChargingStopped({
    required this.energyKwh,
    required this.rewardEaco,
    required this.carbonKg,
  });
  
  @override
  List<Object?> get props => [energyKwh, rewardEaco, carbonKg];
}

class ChargingHistoryLoaded extends ChargingState {
  final List<Map<String, dynamic>> records;
  
  const ChargingHistoryLoaded({required this.records});
  
  @override
  List<Object?> get props => [records];
}

class ChargingError extends ChargingState {
  final String message;
  
  const ChargingError({required this.message});
  
  @override
  List<Object?> get props => [message];
}