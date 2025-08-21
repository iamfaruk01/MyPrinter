# Add project specific ProGuard rules here.
# For more details, see http://developer.android.com/guide/developing/tools/proguard.html

# Keep all classes in the Google Nearby Connections library.
-keep class com.google.android.gms.nearby.** { *; }
-keep interface com.google.android.gms.nearby.** { *; }

# Keep your custom NearbyModule so React Native can find it.
-keep class com.myprinter.NearbyModule { *; }

# Keep your custom NearbyPackage class and all its members.
-keep public class com.myprinter.NearbyPackage { *; }

# Ignore warnings about the missing devsupport package in release builds.
-dontwarn com.facebook.react.devsupport.**