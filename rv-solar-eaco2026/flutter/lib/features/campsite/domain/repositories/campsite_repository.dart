/**
 * 营地仓储接口
 */
import '../models/campsite_model.dart';

abstract class CampsiteRepository {
  Future<List<CampsiteModel>> getCampsites({String? countryCode, bool? hasCharging});
  Future<CampsiteModel> getCampsiteDetail(String id);
  Future<List<CampsiteModel>> searchCampsites(String query);
}