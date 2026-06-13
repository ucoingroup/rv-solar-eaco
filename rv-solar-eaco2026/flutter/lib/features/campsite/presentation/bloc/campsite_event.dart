part of 'campsite_bloc.dart';

abstract class CampsiteEvent extends Equatable {
  const CampsiteEvent();
  
  @override
  List<Object?> get props => [];
}

class LoadCampsites extends CampsiteEvent {
  final String? countryCode;
  final bool? hasCharging;
  
  const LoadCampsites({this.countryCode, this.hasCharging});
  
  @override
  List<Object?> get props => [countryCode, hasCharging];
}

class LoadCampsiteDetail extends CampsiteEvent {
  final String id;
  
  const LoadCampsiteDetail(this.id);
  
  @override
  List<Object?> get props => [id];
}

class SearchCampsites extends CampsiteEvent {
  final String query;
  
  const SearchCampsites(this.query);
  
  @override
  List<Object?> get props => [query];
}