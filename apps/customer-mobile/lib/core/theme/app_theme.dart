import 'package:flutter/material.dart';

class AppTheme {
  // Ozeonix Brand Identity Color System
  static const Color primary = Color(0xFFFF6B00); // Primary Orange
  static const Color primaryHover = Color(0xFFE85F00);
  static const Color secondary = Color(0xFF19CC0E); // Fresh Emerald Green
  static const Color accent = Color(0xFFEC0CF2); // Vibrant Deal Accent
  static const Color navy = Color(0xFF04284A); // Deep Navy
  static const Color background = Color(0xFFFFF9F0); // Warm Ivory
  static const Color surface = Colors.white; // Pure White
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
        tertiary: accent,
        surface: surface,
      ),
      scaffoldBackgroundColor: background,
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: TextStyle(
          color: navy,
          fontSize: 20,
          fontWeight: FontWeight.w800,
          letterSpacing: -0.5,
        ),
        iconTheme: IconThemeData(color: navy),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primary,
          foregroundColor: Colors.white,
          elevation: 0,
          textStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        ),
      ),
      cardTheme: CardThemeData(
        color: surface,
        elevation: 1,
        shadowColor: const Color(0x1504284A),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
          side: const BorderSide(color: coolGray),
        ),
      ),
    );
  }
}
