import 'package:flutter/material.dart';

class AppColors {
  static const Color backgroundColor = Color(0xFFF5F6FA);
  static const Color primaryBlue = Color(0xFF1565C0);
  static const Color greenPositive = Color(0xFF4CAF50);
  static const Color redNegative = Color(0xFFE53935);
  static const Color orangeNeutral = Color(0xFFFF9800);
  static const Color greyText = Color(0xFF6B7280);
  static const Color lightGrey = Color(0xFFE5E7EB);
  static const Color darkGrey = Color(0xFF374151);
  static const Color white = Color(0xFFFFFFFF);
  static const Color filterChipBg = Color(0xFFE3F2FD);
  static const Color cancelButtonRed = Color(0xFFDC2626);
}

class AppTextStyles {
  static const TextStyle headerLarge = TextStyle(
    fontSize: 28,
    fontWeight: FontWeight.w700,
    color: AppColors.darkGrey,
  );
  
  static const TextStyle bodyMedium = TextStyle(
    fontSize: 14,
    fontWeight: FontWeight.w400,
    color: AppColors.darkGrey,
  );
  
  static const TextStyle bodySmall = TextStyle(
    fontSize: 12,
    fontWeight: FontWeight.w400,
    color: AppColors.greyText,
  );
  
  static const TextStyle tableHeader = TextStyle(
    fontSize: 13,
    fontWeight: FontWeight.w600,
    color: AppColors.darkGrey,
  );
  
  static const TextStyle tableCell = TextStyle(
    fontSize: 13,
    fontWeight: FontWeight.w400,
    color: AppColors.darkGrey,
  );
  
  static const TextStyle navBarStock = TextStyle(
    fontSize: 14,
    fontWeight: FontWeight.w500,
    color: AppColors.darkGrey,
  );
  
  static const TextStyle navBarValue = TextStyle(
    fontSize: 14,
    fontWeight: FontWeight.w600,
  );
}

class AppSpacing {
  static const double xs = 4.0;
  static const double sm = 8.0;
  static const double md = 16.0;
  static const double lg = 24.0;
  static const double xl = 32.0;
}