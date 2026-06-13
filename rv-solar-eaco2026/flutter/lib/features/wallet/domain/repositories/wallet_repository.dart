/**
 * 钱包仓储接口
 */
abstract class WalletRepository {
  Future<Map<String, dynamic>> getWallet();
}