/**
 * 营地远程数据源
 */
import '../../../../core/network/api_client.dart';

abstract class CampsiteRemoteDataSource {
  Future<List<Map<String, dynamic>>> getCampsites({String? countryCode, bool? hasCharging});
  Future<Map<String, dynamic>> getCampsiteDetail(String id);
  Future<List<Map<String, dynamic>>> searchCampsites(String query);
}

class CampsiteRemoteDataSourceImpl implements CampsiteRemoteDataSource {
  final ApiClient _apiClient;
  
  CampsiteRemoteDataSourceImpl(this._apiClient);
  
  @override
  Future<List<Map<String, dynamic>>> getCampsites({
    String? countryCode,
    bool? hasCharging,
  }) async {
    final params = <String, dynamic>{};
    if (countryCode != null) params['country_code'] = countryCode;
    if (hasCharging == true) params['has_charging'] = 'true';
    
    final response = await _apiClient.get('/campsites', queryParameters: params);
    final data = response.data;
    if (data['code'] != 0) throw Exception(data['message']);
    
    final List<dynamic> list = data['data']['campsites'] ?? [];
    return list.cast<Map<String, dynamic>>();
  }
  
  @override
  Future<Map<String, dynamic>> getCampsiteDetail(String id) async {
    final response = await _apiClient.get('/campsites/$id');
    final data = response.data;
    if (data['code'] != 0) throw Exception(data['message']);
    return data['data'];
  }
  
  @override
  Future<List<Map<String, dynamic>>> searchCampsites(String query) async {
    final response = await _apiClient.get('/campsites', queryParameters: {'q': query});
    final data = response.data;
    if (data['code'] != 0) throw Exception(data['message']);
    
    final List<dynamic> list = data['data']['campsites'] ?? [];
    return list.cast<Map<String, dynamic>>();
  }
}