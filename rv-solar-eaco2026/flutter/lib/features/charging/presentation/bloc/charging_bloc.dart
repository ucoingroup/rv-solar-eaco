/**
 * 充电Bloc
 */
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../../domain/repositories/charging_repository.dart';

part 'charging_event.dart';
part 'charging_state.dart';

class ChargingBloc extends Bloc<ChargingEvent, ChargingState> {
  final ChargingRepository _repository;
  
  ChargingBloc(this._repository) : super(ChargingInitial()) {
    on<GetCurrentCharging>(_onGetCurrentCharging);
    on<StartCharging>(_onStartCharging);
    on<StopCharging>(_onStopCharging);
    on<GetChargingHistory>(_onGetChargingHistory);
  }
  
  Future<void> _onGetCurrentCharging(
    GetCurrentCharging event,
    Emitter<ChargingState> emit,
  ) async {
    emit(ChargingLoading());
    try {
      final session = await _repository.getCurrentCharging();
      if (session != null) {
        emit(ChargingInProgress(
          chargingId: session['id'],
          chargerId: session['charger_id'],
          energyKwh: (session['energy_kwh'] ?? 0).toDouble(),
          powerW: (session['power_w'] ?? 0).toDouble(),
          voltageV: (session['voltage_v'] ?? 0).toDouble(),
          currentA: (session['current_a'] ?? 0).toDouble(),
        ));
      } else {
        emit(ChargingIdle());
      }
    } catch (e) {
      emit(ChargingIdle());
    }
  }
  
  Future<void> _onStartCharging(
    StartCharging event,
    Emitter<ChargingState> emit,
  ) async {
    emit(ChargingLoading());
    try {
      final result = await _repository.startCharging(event.chargerId);
      emit(ChargingStarted(
        chargingId: result['charging_id'],
        energyKwh: (result['energy_kwh'] ?? 0).toDouble(),
        powerW: (result['power_w'] ?? 0).toDouble(),
      ));
    } catch (e) {
      emit(ChargingError(message: e.toString()));
    }
  }
  
  Future<void> _onStopCharging(
    StopCharging event,
    Emitter<ChargingState> emit,
  ) async {
    emit(ChargingLoading());
    try {
      final result = await _repository.stopCharging(event.chargingId);
      emit(ChargingStopped(
        energyKwh: (result['total_energy_kwh'] ?? 0).toDouble(),
        rewardEaco: result['reward_eaco'] ?? 0,
        carbonKg: (result['carbon_kg'] ?? 0).toDouble(),
      ));
    } catch (e) {
      emit(ChargingError(message: e.toString()));
    }
  }
  
  Future<void> _onGetChargingHistory(
    GetChargingHistory event,
    Emitter<ChargingState> emit,
  ) async {
    try {
      final history = await _repository.getChargingHistory();
      emit(ChargingHistoryLoaded(records: history));
    } catch (e) {
      emit(ChargingError(message: e.toString()));
    }
  }
}