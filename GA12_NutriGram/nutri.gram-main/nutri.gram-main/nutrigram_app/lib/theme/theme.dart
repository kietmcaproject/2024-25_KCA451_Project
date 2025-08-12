import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:nutrigram_app/constants/constants.dart';

final ThemeData _lightThemeData = ThemeData.light();
final ThemeData _darkThemeData = ThemeData.dark();
final ThemeData kDarkTheme = ThemeData(
  visualDensity: VisualDensity.adaptivePlatformDensity,
  brightness: Brightness.dark,
  cardColor: kPrimaryMediumTextColor,
  appBarTheme: const AppBarTheme(
    color: kPrimaryDarkTextColor,
    elevation: 0.0,
    iconTheme: IconThemeData(
      color: kTextFieldBackgroundColor,
    ), systemOverlayStyle: SystemUiOverlayStyle.dark,
  ),
  scaffoldBackgroundColor: kPrimaryDarkTextColor,
  primaryIconTheme: const IconThemeData(color: kTextFieldBackgroundColor),
  inputDecorationTheme: InputDecorationTheme(
    fillColor: kPrimaryMediumTextColor,
    filled: true,
    border: OutlineInputBorder(
      borderSide: BorderSide.none,
      borderRadius: BorderRadius.circular(8),
    ),
  ),
  popupMenuTheme: PopupMenuThemeData(
    textStyle: _darkThemeData.textTheme.titleMedium,
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(8),
    ),
  ),
  buttonTheme: ButtonThemeData(
    buttonColor: kPrimaryColor,
    textTheme: ButtonTextTheme.primary,
    height: 48,
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(8),
    ),
  ),
  textTheme: TextTheme(
    displayLarge: _darkThemeData.textTheme.displayLarge.copyWith(
      fontFamily: kFontFamily,
      fontSize: 96,
      fontWeight: FontWeight.w300,
    ),
    displayMedium: _darkThemeData.textTheme.displayMedium.copyWith(
      fontFamily: kFontFamily,
      fontSize: 60,
      fontWeight: FontWeight.w600,
    ),
    displaySmall: _darkThemeData.textTheme.displaySmall.copyWith(
      fontFamily: kFontFamily,
      fontSize: 20,
      fontWeight: FontWeight.w500,
      color: kTextFieldBackgroundColor,
    ),
    headlineMedium: _darkThemeData.textTheme.headlineMedium.copyWith(
      fontFamily: kFontFamily,
      fontSize: 30,
      fontWeight: FontWeight.w600,
      color: kTextFieldBackgroundColor,
    ),
    bodyLarge: _darkThemeData.textTheme.bodyLarge.copyWith(
      fontFamily: kFontFamily,
      fontSize: 18,
      fontWeight: FontWeight.normal,
      color: kPrimaryDarkTextColor,
    ),
    bodyMedium: _darkThemeData.textTheme.bodyMedium.copyWith(
      fontFamily: kFontFamily,
      fontSize: 14,
      fontWeight: FontWeight.normal,
      color: kPrimaryDarkTextColor,
    ),
    labelLarge: _darkThemeData.textTheme.labelLarge.copyWith(
      fontFamily: kFontFamily,
      fontSize: 14,
      fontWeight: FontWeight.w500,
      color: kTextFieldBackgroundColor,
    ),
    bodySmall: _darkThemeData.textTheme.bodySmall.copyWith(
      fontFamily: kFontFamily,
      fontSize: 12,
      fontWeight: FontWeight.normal,
      color: kTextFieldBackgroundColor,
    ),
    titleMedium: _darkThemeData.textTheme.titleMedium.copyWith(
      fontFamily: kFontFamily,
      fontSize: 14,
      fontWeight: FontWeight.w500,
      color: kTextFieldBackgroundColor,
    ),
  ), textSelectionTheme: const TextSelectionThemeData(cursorColor: kPrimaryColor), colorScheme: ColorScheme.fromSwatch().copyWith(secondary: kPrimaryColor), bottomAppBarTheme: const BottomAppBarTheme(color: Colors.black),
);
final ThemeData kLightTheme = ThemeData(
  visualDensity: VisualDensity.adaptivePlatformDensity,
  brightness: Brightness.light,
  popupMenuTheme: PopupMenuThemeData(
    textStyle: _lightThemeData.textTheme.titleMedium,
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(8),
    ),
  ),
  cardColor: kTextFieldBackgroundColor,
  appBarTheme: const AppBarTheme(
    color: kScaffoldBackgroundColor,
    elevation: 0.0, systemOverlayStyle: SystemUiOverlayStyle.light,
  ),
  scaffoldBackgroundColor: kScaffoldBackgroundColor,
  primaryColor: kPrimaryColor,
  fontFamily: kFontFamily,
  primaryIconTheme: const IconThemeData(
    color: kDisabledLightThemeColor,
  ),
  inputDecorationTheme: InputDecorationTheme(
    fillColor: kTextFieldBackgroundColor,
    filled: true,
    border: OutlineInputBorder(
      borderSide: BorderSide.none,
      borderRadius: BorderRadius.circular(8),
    ),
  ),
  buttonTheme: ButtonThemeData(
    buttonColor: kPrimaryColor,
    textTheme: ButtonTextTheme.primary,
    height: 48,
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(8),
    ),
  ),
  textTheme: TextTheme(
    displayLarge: _lightThemeData.textTheme.displayLarge.copyWith(
      fontFamily: kFontFamily,
      fontSize: 96,
      fontWeight: FontWeight.w300,
    ),
    displayMedium: _lightThemeData.textTheme.displayMedium.copyWith(
      fontFamily: kFontFamily,
      fontSize: 60,
      fontWeight: FontWeight.w600,
    ),
    displaySmall: _lightThemeData.textTheme.displaySmall.copyWith(
      fontFamily: kFontFamily,
      fontSize: 20,
      color: kPrimaryMediumTextColor,
      fontWeight: FontWeight.w500,
    ),
    titleMedium: _lightThemeData.textTheme.titleMedium.copyWith(
      fontFamily: kFontFamily,
      fontSize: 14,
      fontWeight: FontWeight.w500,
    ),
    headlineMedium: _lightThemeData.textTheme.headlineMedium.copyWith(
      fontFamily: kFontFamily,
      fontSize: 30,
      fontWeight: FontWeight.w600,
      color: kPrimaryDarkTextColor,
    ),
    bodyLarge: _lightThemeData.textTheme.bodyLarge.copyWith(
      fontFamily: kFontFamily,
      fontSize: 18,
      fontWeight: FontWeight.normal,
      color: kPrimaryDarkTextColor,
    ),
    bodyMedium: _lightThemeData.textTheme.bodyMedium.copyWith(
      fontFamily: kFontFamily,
      fontSize: 14,
      fontWeight: FontWeight.normal,
      color: kPrimaryDarkTextColor,
    ),
    labelLarge: _lightThemeData.textTheme.labelLarge.copyWith(
      fontFamily: kFontFamily,
      fontSize: 14,
      fontWeight: FontWeight.w500,
      color: kPrimaryMediumTextColor,
    ),
    bodySmall: _lightThemeData.textTheme.bodySmall.copyWith(
      fontFamily: kFontFamily,
      fontSize: 12,
      fontWeight: FontWeight.normal,
      color: kPrimaryLightTextColor,
    ),
  ), textSelectionTheme: const TextSelectionThemeData(cursorColor: kPrimaryColor), colorScheme: ColorScheme.fromSwatch().copyWith(secondary: kPrimaryColor),
);
