/**
 * 充电仓储实现
 */
import '../../domain/repositories/charging_repository.dart';
import '../datasources/charging_remote_datasource.dart';

class ChargingRepositoryImpl implements ChargingRepository {
  final ChargingRemoteDataSource _remoteDataSource;
  
  ChargingRepositoryImpl(this._remoteDataSource);
  
  @override
  Future<Map<String, dynamic>?> getCurrentCharging() async {
    return _remoteDataSource.getCurrentCharging();
  }
  
  @override
  Future<Map<String, dynamic>> startCharging(String chargerId) async {
    return _remoteDataSource.startCharging(chargerId);
  }
  
  @override
  Future<Map<String, dynamic>> stopCharging(String chargingId) async {
    return _remoteDataSource.stopCharging(chargingId);
  }
  
  @override
  Future<List<Map<String, dynamic>>> getChargingHistory() async {
    return _remoteDataSource.getChargingHistory();
  }
}