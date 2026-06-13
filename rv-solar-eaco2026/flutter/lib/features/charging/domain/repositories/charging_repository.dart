/**
 * 充电仓储接口
 */
abstract class ChargingRepository {
  Future<Map<String, dynamic>?> getCurrentCharging();
  Future<Map<String, dynamic>> startCharging(String chargerId);
  Future<Map<String, dynamic>> stopCharging(String chargingId);
  Future<List<Map<String, dynamic>>> getChargingHistory();
}