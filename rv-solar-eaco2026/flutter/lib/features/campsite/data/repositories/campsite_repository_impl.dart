/**
 * 营地仓储实现
 */
import '../../domain/models/campsite_model.dart';
import '../../domain/repositories/campsite_repository.dart';
import '../datasources/campsite_remote_datasource.dart';

class CampsiteRepositoryImpl implements CampsiteRepository {
  final CampsiteRemoteDataSource _remoteDataSource;
  
  CampsiteRepositoryImpl(this._remoteDataSource);
  
  @override
  Future<List<CampsiteModel>> getCampsites({
    String? countryCode,
    bool? hasCharging,
  }) async {
    final data = await _remoteDataSource.getCampsites(
      countryCode: countryCode,
      hasCharging: hasCharging,
    );
    return data.map((json) => CampsiteModel.fromJson(json)).toList();
  }
  
  @override
  Future<CampsiteModel> getCampsiteDetail(String id) async {
    final data = await _remoteDataSource.getCampsiteDetail(id);
    return CampsiteModel.fromJson(data);
  }
  
  @override
  Future<List<CampsiteModel>> searchCampsites(String query) async {
    final data = await _remoteDataSource.searchCampsites(query);
    return data.map((json) => CampsiteModel.fromJson(json)).toList();
  }
}