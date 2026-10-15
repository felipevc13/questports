-- Crazy Taxi VR Standalone install text, copied from the project README.
-- https://github.com/Baywilly/Crazy-Taxi-VR-Standalone/blob/main/README.md
-- Apply manually in the Supabase SQL editor after merge.
-- Do not run this from CI or against production from the agent.

begin;

update public.ports
   set installation_guide = $guide$Since Crazy Taxi was removed from digital stores by SEGA, the project distributes an XDelta patch instead of the complete commercial game.

These steps are the project's own install instructions: [Crazy Taxi VR Standalone README](https://github.com/Baywilly/Crazy-Taxi-VR-Standalone/blob/main/README.md).

### 1. Obtain the compatible original file

To use the patch, you need a legitimate copy of the compatible original game file.

The specific file used to prepare the patch has the following name:

`com.sega.CrazyTaxiplayhaven_6.0-80_2arch_7dpi_24lang_1feat_017e8b1c582569ff9682193551b7e22c_apkmirror.com.apkm`

The patch is designed for this specific file and may not work with other versions of Crazy Taxi for Android.

The filename is provided as a reference to identify the compatible version. Original game files must be obtained through legal means.

### 2. Download the XDelta patch

In the Releases section of the repository, download **crazywilly.xdelta** and save it to your computer.

[crazywilly.xdelta](https://github.com/Baywilly/Crazy-Taxi-VR-Standalone/releases/download/v0.1-beta/crazywilly.xdelta)

### 3. Download Delta Patcher

To apply the patch, you need the free program Delta Patcher.

https://github.com/marco-calautti/DeltaPatcher

Download the program to your computer and run it.

The computer is only needed to prepare and install the game. Once installed, Crazy Taxi VR runs directly on your Meta Quest headset.

### 4. Apply the XDelta patch

Open Delta Patcher on your computer.

**Original file:** select the original Crazy Taxi file named above.

**XDelta patch:** select `crazywilly.xdelta`.

1. Select both files in their corresponding fields.
2. Click **Apply patch**.
3. Wait for the patching process to finish.

Once the process is complete, the original file will have been patched. Rename the file extension from `.apkm` to `.apk`.

After completing these steps, you should have the Crazy Taxi VR Standalone file ready to install on your Meta Quest headset.

### 5. Install Crazy Taxi VR on Meta Quest

1. Connect your Meta Quest headset to your computer using a USB cable.
2. Make sure Developer Mode and the necessary permissions for installing external applications are enabled.
3. Open **SideQuest** or another compatible installation tool.
4. Select the `.apk` file you just patched.
5. Install it on your headset.
6. Wait for the installation to finish.

Once the installation is complete, you can disconnect the USB cable.

### 6. Launch Crazy Taxi VR Standalone

Put on your Meta Quest headset and open your app library.

Find **Crazy Taxi VR Standalone** among your installed applications.

Launch the game, select your driver, and get ready to hit the streets.$guide$,
       troubleshooting_notes = $notes$Delta Patcher shows an error: make sure you have selected the exact original file and that the patch has been downloaded correctly. The patched APK does not install: make sure the patching process completed without errors and that the resulting file is compatible with your headset. The game does not appear on the headset: check the section for sideloaded or unknown-source applications. The controllers are not responding: check the controller mapping image for your language and make sure the controllers are properly connected. The camera is not centered: press the right joystick to recenter the view. An error occurs during gameplay: you can report it through the Issues section of this repository or share your experience with the community.$notes$
 where slug = 'crazy-taxi-vr'
   and (
     installation_guide is distinct from $guide$Since Crazy Taxi was removed from digital stores by SEGA, the project distributes an XDelta patch instead of the complete commercial game.

These steps are the project's own install instructions: [Crazy Taxi VR Standalone README](https://github.com/Baywilly/Crazy-Taxi-VR-Standalone/blob/main/README.md).

### 1. Obtain the compatible original file

To use the patch, you need a legitimate copy of the compatible original game file.

The specific file used to prepare the patch has the following name:

`com.sega.CrazyTaxiplayhaven_6.0-80_2arch_7dpi_24lang_1feat_017e8b1c582569ff9682193551b7e22c_apkmirror.com.apkm`

The patch is designed for this specific file and may not work with other versions of Crazy Taxi for Android.

The filename is provided as a reference to identify the compatible version. Original game files must be obtained through legal means.

### 2. Download the XDelta patch

In the Releases section of the repository, download **crazywilly.xdelta** and save it to your computer.

[crazywilly.xdelta](https://github.com/Baywilly/Crazy-Taxi-VR-Standalone/releases/download/v0.1-beta/crazywilly.xdelta)

### 3. Download Delta Patcher

To apply the patch, you need the free program Delta Patcher.

https://github.com/marco-calautti/DeltaPatcher

Download the program to your computer and run it.

The computer is only needed to prepare and install the game. Once installed, Crazy Taxi VR runs directly on your Meta Quest headset.

### 4. Apply the XDelta patch

Open Delta Patcher on your computer.

**Original file:** select the original Crazy Taxi file named above.

**XDelta patch:** select `crazywilly.xdelta`.

1. Select both files in their corresponding fields.
2. Click **Apply patch**.
3. Wait for the patching process to finish.

Once the process is complete, the original file will have been patched. Rename the file extension from `.apkm` to `.apk`.

After completing these steps, you should have the Crazy Taxi VR Standalone file ready to install on your Meta Quest headset.

### 5. Install Crazy Taxi VR on Meta Quest

1. Connect your Meta Quest headset to your computer using a USB cable.
2. Make sure Developer Mode and the necessary permissions for installing external applications are enabled.
3. Open **SideQuest** or another compatible installation tool.
4. Select the `.apk` file you just patched.
5. Install it on your headset.
6. Wait for the installation to finish.

Once the installation is complete, you can disconnect the USB cable.

### 6. Launch Crazy Taxi VR Standalone

Put on your Meta Quest headset and open your app library.

Find **Crazy Taxi VR Standalone** among your installed applications.

Launch the game, select your driver, and get ready to hit the streets.$guide$
     or troubleshooting_notes is distinct from $notes$Delta Patcher shows an error: make sure you have selected the exact original file and that the patch has been downloaded correctly. The patched APK does not install: make sure the patching process completed without errors and that the resulting file is compatible with your headset. The game does not appear on the headset: check the section for sideloaded or unknown-source applications. The controllers are not responding: check the controller mapping image for your language and make sure the controllers are properly connected. The camera is not centered: press the right joystick to recenter the view. An error occurs during gameplay: you can report it through the Issues section of this repository or share your experience with the community.$notes$
   );

commit;
