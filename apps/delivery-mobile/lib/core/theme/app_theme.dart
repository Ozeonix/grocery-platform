import 'package:flutter/material.dart';

class AppTheme {
  // Ozeonix Brand Identity System for Delivery Partner Fleet
  static const Color primary = Color(0xFFFF6B00); // Primary Action Orange
  static const Color primaryDark = Color(0xFFE85F00);
  static const Color secondary = Color(0xFF19CC0E); // Success / Online Emerald
  static const Color accent = Color(0xFFEC0CF2); // Alert / Surge Accent
  static const Color navy = Color(0xFF04284A); // Deep Navy Anchor
  static const Color background = Color(0xFFFFF9F0); // Warm Ivory
  static const Color surface = Colors.white;
  static const Color textPrimary = Color(0xFF04284A);
  static const Color textSecondary = Color(0xFF64748B);
  static const Color coolGray = Color(0xFFE8EDF2);

  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: primary,
        primary: primary,
        secondary: secondary,
        surface: surface,
      ),
      scaffoldBackgroundColor: background,
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: false,
        iconTheme: IconThemeData(color: navy),
        titleTextStyle: TextStyle(
          color: navy,
          fontSize: 18,
          fontWeight: FontWeight.w800,
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primary,
          foregroundColor: Colors.white,
          textStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        ),
      ),
    );
  }
}
