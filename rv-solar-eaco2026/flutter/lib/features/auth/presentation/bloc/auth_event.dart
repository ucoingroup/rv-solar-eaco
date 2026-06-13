part of 'auth_bloc.dart';

abstract class AuthEvent extends Equatable {
  const AuthEvent();
  
  @override
  List<Object?> get props => [];
}

class AuthCheckRequested extends AuthEvent {}

class SendCodeRequested extends AuthEvent {
  final String phoneCode;
  final String phoneNumber;
  
  const SendCodeRequested({
    required this.phoneCode,
    required this.phoneNumber,
  });
  
  @override
  List<Object?> get props => [phoneCode, phoneNumber];
}

class VerifyCodeRequested extends AuthEvent {
  final String phoneCode;
  final String phoneNumber;
  final String code;
  
  const VerifyCodeRequested({
    required this.phoneCode,
    required this.phoneNumber,
    required this.code,
  });
  
  @override
  List<Object?> get props => [phoneCode, phoneNumber, code];
}

class LogoutRequested extends AuthEvent {}