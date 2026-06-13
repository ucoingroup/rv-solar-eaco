/**
 * 钱包仓储实现
 */
import '../../domain/repositories/wallet_repository.dart';
import '../datasources/wallet_remote_datasource.dart';

class WalletRepositoryImpl implements WalletRepository {
  final WalletRemoteDataSource _remoteDataSource;
  
  WalletRepositoryImpl(this._remoteDataSource);
  
  @override
  Future<Map<String, dynamic>> getWallet() async {
    return _remoteDataSource.getWallet();
  }
}