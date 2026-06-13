/**
 * 营地Bloc
 */
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../../domain/repositories/campsite_repository.dart';
import '../../domain/models/campsite_model.dart';

part 'campsite_event.dart';
part 'campsite_state.dart';

class CampsiteBloc extends Bloc<CampsiteEvent, CampsiteState> {
  final CampsiteRepository _repository;
  
  CampsiteBloc(this._repository) : super(CampsiteInitial()) {
    on<LoadCampsites>(_onLoadCampsites);
    on<LoadCampsiteDetail>(_onLoadCampsiteDetail);
    on<SearchCampsites>(_onSearchCampsites);
  }
  
  Future<void> _onLoadCampsites(
    LoadCampsites event,
    Emitter<CampsiteState> emit,
  ) async {
    emit(CampsiteLoading());
    try {
      final campsites = await _repository.getCampsites(
        countryCode: event.countryCode,
        hasCharging: event.hasCharging,
      );
      emit(CampsiteLoaded(campsites: campsites));
    } catch (e) {
      emit(CampsiteError(message: e.toString()));
    }
  }
  
  Future<void> _onLoadCampsiteDetail(
    LoadCampsiteDetail event,
    Emitter<CampsiteState> emit,
  ) async {
    emit(CampsiteLoading());
    try {
      final campsite = await _repository.getCampsiteDetail(event.id);
      emit(CampsiteDetailLoaded(campsite: campsite));
    } catch (e) {
      emit(CampsiteError(message: e.toString()));
    }
  }
  
  Future<void> _onSearchCampsites(
    SearchCampsites event,
    Emitter<CampsiteState> emit,
  ) async {
    emit(CampsiteLoading());
    try {
      final campsites = await _repository.searchCampsites(event.query);
      emit(CampsiteLoaded(campsites: campsites));
    } catch (e) {
      emit(CampsiteError(message: e.toString()));
    }
  }
}