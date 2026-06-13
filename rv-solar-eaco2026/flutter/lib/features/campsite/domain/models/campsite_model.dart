/**
 * 营地模型
 */
class CampsiteModel {
  final String id;
  final String name;
  final String? nameEn;
  final String countryCode;
  final String countryName;
  final String? address;
  final double latitude;
  final double longitude;
  final String? description;
  final String? descriptionEn;
  final int priceUsdCents;
  final double solarCapacityKw;
  final int chargingSpots;
  final int maxChargingPowerW;
  final List<String> amenities;
  final List<String> images;
  final String? contactPhone;
  final String? contactWechat;
  final String? operatorName;
  final double rating;
  final int ratingCount;
  
  CampsiteModel({
    required this.id,
    required this.name,
    this.nameEn,
    required this.countryCode,
    required this.countryName,
    this.address,
    required this.latitude,
    required this.longitude,
    this.description,
    this.descriptionEn,
    required this.priceUsdCents,
    required this.solarCapacityKw,
    required this.chargingSpots,
    required this.maxChargingPowerW,
    required this.amenities,
    required this.images,
    this.contactPhone,
    this.contactWechat,
    this.operatorName,
    required this.rating,
    required this.ratingCount,
  });
  
  factory CampsiteModel.fromJson(Map<String, dynamic> json) {
    return CampsiteModel(
      id: json['id'],
      name: json['name'],
      nameEn: json['name_en'],
      countryCode: json['country_code'] ?? '',
      countryName: json['country_name'] ?? '',
      address: json['address'],
      latitude: (json['latitude'] ?? 0).toDouble(),
      longitude: (json['longitude'] ?? 0).toDouble(),
      description: json['description'],
      descriptionEn: json['description_en'],
      priceUsdCents: json['price_usd_cents'] ?? 0,
      solarCapacityKw: (json['solar_capacity_kw'] ?? 0).toDouble(),
      chargingSpots: json['charging_spots'] ?? 0,
      maxChargingPowerW: json['max_charging_power_w'] ?? 0,
      amenities: List<String>.from(json['amenities'] ?? []),
      images: List<String>.from(json['images'] ?? []),
      contactPhone: json['contact_phone'],
      contactWechat: json['contact_wechat'],
      operatorName: json['operator_name'],
      rating: (json['rating'] ?? 0).toDouble(),
      ratingCount: json['rating_count'] ?? 0,
    );
  }
}