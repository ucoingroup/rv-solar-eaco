/**
 * 充电远程数据源
 */
import '../../../../core/network/api_client.dart';

abstract class ChargingRemoteDataSource {
  Future<Map<String, dynamic>?> getCurrentCharging();
  Future<Map<String, dynamic>> startCharging(String chargerId);
  Future<Map<String, dynamic>> stopCharging(String chargingId);
  Future<List<Map<String, dynamic>>> getChargingHistory();
}

class ChargingRemoteDataSourceImpl implements ChargingRemoteDataSource {
  final ApiClient _apiClient;
  
  ChargingRemoteDataSourceImpl(this._apiClient);
  
  @override
  Future<Map<String, dynamic>?> getCurrentCharging() async {
    try {
      final response = await _apiClient.get('/charging/current');
      final data = response.data;
      if (data['code'] != 0) return null;
      if (data['data']['has_active'] != true) return null;
      return data['data'];
    } catch (e) {
      return null;
    }
  }
  
  @override
  Future<Map<String, dynamic>> startCharging(String chargerId) async {
    final response = await _apiClient.post('/charging/start', data: {
      'charger_id': chargerId,
      'payment_token': 'EACO',
    });
    final data = response.data;
    if (data['code'] != 0) throw Exception(data['message']);
    return data['data'];
  }
  
  @override
  Future<Map<String, dynamic>> stopCharging(String chargingId) async {
    final response = await _apiClient.post('/charging/stop', data: {
      'charging_id': chargingId,
    });
    final data = response.data;
    if (data['code'] != 0) throw Exception(data['message']);
    return data['data'];
  }
  
  @override
  Future<List<Map<String, dynamic>>> getChargingHistory() async {
    final response = await _apiClient.get('/charging/history');
    final data = response.data;
    if (data['code'] != 0) throw Exception(data['message']);
    final List<dynamic> list = data['data']['records'] ?? [];
    return list.cast<Map<String, dynamic>>();
  }
}