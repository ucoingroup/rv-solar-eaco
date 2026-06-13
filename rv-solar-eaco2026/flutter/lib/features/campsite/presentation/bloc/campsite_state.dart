part of 'campsite_bloc.dart';

abstract class CampsiteState extends Equatable {
  const CampsiteState();
  
  @override
  List<Object?> get props => [];
}

class CampsiteInitial extends CampsiteState {}

class CampsiteLoading extends CampsiteState {}

class CampsiteLoaded extends CampsiteState {
  final List<CampsiteModel> campsites;
  
  const CampsiteLoaded({required this.campsites});
  
  @override
  List<Object?> get props => [campsites];
}

class CampsiteDetailLoaded extends CampsiteState {
  final CampsiteModel campsite;
  
  const CampsiteDetailLoaded({required this.campsite});
  
  @override
  List<Object?> get props => [campsite];
}

class CampsiteError extends CampsiteState {
  final String message;
  
  const CampsiteError({required this.message});
  
  @override
  List<Object?> get props => [message];
}