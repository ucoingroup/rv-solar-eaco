/**
 * 钱包远程数据源
 */
import '../../../../core/network/api_client.dart';

abstract class WalletRemoteDataSource {
  Future<Map<String, dynamic>> getWallet();
}

class WalletRemoteDataSourceImpl implements WalletRemoteDataSource {
  final ApiClient _apiClient;
  
  WalletRemoteDataSourceImpl(this._apiClient);
  
  @override
  Future<Map<String, dynamic>> getWallet() async {
    final response = await _apiClient.get('/users/wallet');
    final data = response.data;
    if (data['code'] != 0) throw Exception(data['message']);
    return data['data'];
  }
}