# Testing the one-click Quest install

The install card talks to a headset with **WebUSB** and **ADB** (`navigator.usb` plus [`@yume-chan/adb`](https://github.com/yume-chan/ya-webadb)). A normal visit never sees a fake device.

Add `mockQuest=1` to the page URL to switch on a **simulated Quest 3** (`MOCK-QUEST-001`). The flag is the only switch. Leave it off and the site uses the real WebUSB path, including on the production build.

```text
http://localhost:3000/ports/rtcwquest?mockQuest=1
```

A **Simulated Quest** panel sits at the bottom-left while the flag is on. It is not part of the product UI. `mockChrome=0` hides the panel and leaves the simulation running, which is useful for screenshots.

`mockQuest=0`, `false`, `off`, or `no` disables it. Omitting the parameter disables it.

## Drive the headset

| Query | Values | What it does |
| --- | --- | --- |
| `mockPhase` | `disconnected` (default), `unsupported`, `picker`, `authorizing`, `connected`, `scanning`, `unauthorized`, `usb-locked`, `cancelled`, `timeout`, `generic` | The state already on screen when the page loads |
| `mockNext` | `ok` (default), `picker-cancel`, `unauthorized`, `usb-locked`, `cancelled`, `timeout`, `generic` | What the next **Connect** click does after the simulated USB prompt |
| `mockInstall` | `ok` (default), `hold-downloading`, `hold-pushing`, `hold-installing`, `hold-success`, `download-failed`, `storage`, `disconnect`, `unauthorized`, `pm-failed` | What the next **Install APK** click does |
| `mockGame` | `absent` (default), `installed`, `outdated` | Whether every catalog package is on the headset, and whether `versionName` is older than the catalog |
| `mockFiles` | `missing` (default), `stray`, `primary`, `alternate`, `present` | `missing` leaves storage empty. `stray` puts only `unrelated-note.txt` in each scanned folder (the send-files box stays up, except CitraVR / PPSSPP VR / PrimedGun, which still treat any file as present). `primary` and `present` place each game's required filenames in its main folder. `alternate` places them in the first real alternate folder, or the `/storage/emulated/0` alias when the game has no second folder. |
| `mockUninstall` | `ok` (default), `fail` | `pm uninstall` result |
| `mockTransfer` | `ok` (default), `hold` | Pause a drag-and-drop file copy mid-transfer |
| `mockLaunch` | `ok` (default), `slow` | Keep **Launching...** on screen long enough to see it |
| `mockSpeed` | `normal` (default), `instant` | Skip the short pauses between download, transfer, and `pm install` |
| `mockChrome` | `1` (default), `0` | Show or hide the panel |

You can also set the phase as the flag itself: `?mockQuest=connected` is the same as `?mockQuest=1&mockPhase=connected`. `mockPhase` wins if both are set.

Changing the panel writes these parameters into the address bar and rebuilds the fake headset. A refresh keeps the same state.

## Install-flow states

Open a port that has a direct APK button, for example Return to Castle Wolfenstein:

`/ports/rtcwquest`

| State | How to show it |
| --- | --- |
| No headset | `?mockQuest=1` (or `mockPhase=disconnected`). The card says **No Quest Connected**. |
| Unsupported browser | `mockPhase=unsupported`. The card shows **WebUSB is not supported in this browser**. The Connect buttons do not call into ADB in this state (see rough edges in the panel notes below). |
| USB permission prompt | `mockPhase=picker`. A simulated Chrome device chooser lists **Meta Quest**. The card stays on **No Quest Connected** and asks you to select the Quest in the browser window. The amber headset banner stays hidden. **Cancel** returns to **No Quest Connected** and shows a dismissible hint: **No Quest found. Check the USB cable and that Developer Mode is enabled.** **Connect** continues to the visor step. |
| Authorizing / visor prompt | `mockPhase=authorizing`. Amber **Action Required inside Headset!** banner, navbar **Authorizing Quest...**, and a simulated **Allow USB debugging?** prompt. **Allow** connects. **Deny** shows the cancelled-by-headset error. |
| Connected, game not installed | `mockPhase=connected&mockGame=absent`. Green **Quest 3** pill (78% battery, 88G free). **Install APK on Quest (1-Click)**. Open the navbar pill for the storage and battery dropdown. |
| Scanning storage | `mockPhase=scanning&mockGame=installed&mockFiles=missing` on a game that needs files. The card stays on **Scanning...** because the fake `ls` does not return. |
| Downloading | Connected, game absent, `mockInstall=hold-downloading`, then click **Install APK**. Holds on **Downloading latest APK from repository...** at 2%. |
| Transferring the APK | `mockInstall=hold-pushing`, then click **Install APK**. Holds on **Transferring APK to Quest**. |
| Installing | `mockInstall=hold-installing`, then click **Install APK**. Holds on **Installing APK package on Quest OS (pm install)...** at 90%. |
| Success message | `mockInstall=hold-success`, then click **Install APK**. Holds at 100% with **Successfully installed!** |
| Installed, nothing else to copy | `mockPhase=connected&mockGame=installed` on `/ports/iron-lung-vr` or `/ports/questcraft`. **Standalone Port Ready to Play!** and **Launch on Quest**. |
| Installed, external files missing | `mockPhase=connected&mockGame=installed&mockFiles=missing` on `/ports/rtcwquest`. **Drag & drop** send-files box. No **Launch on Quest**. |
| Installed, stray file only | `mockPhase=connected&mockGame=installed&mockFiles=stray` on `/ports/rtcwquest`. The send-files box stays up. **Launch on Quest** stays hidden. |
| Installed, required files in the main folder | `mockPhase=connected&mockGame=installed&mockFiles=primary` (or `present`) on `/ports/perfect-dark-vr`. **Ready to Play on Quest!**, **Verified on Quest**, and **Launch on Quest**. |
| Installed, required files in an alternate folder | `mockPhase=connected&mockGame=installed&mockFiles=alternate` on `/ports/questsam`. Same ready card. The detected path is the legacy folder, not the app-data folder. |
| Installed, external files present | `mockPhase=connected&mockGame=installed&mockFiles=present` on `/ports/rtcwquest`. **Ready to Play on Quest!**, **Verified on Quest**, and **Launch on Quest**. |
| Update available | `mockPhase=connected&mockGame=outdated&mockFiles=present`. Badge **Update available** and **Update to …**. |
| Download failed | `mockInstall=download-failed`, then click **Install APK**. **Installation Issue: Failed to download APK: …** |
| Not enough storage | `mockInstall=storage`, then click **Install APK**. The storage meter drops to **184M free / 99%**, and install ends with `INSTALL_FAILED_INSUFFICIENT_STORAGE`. |
| Disconnect mid-install | `mockInstall=disconnect`, then click **Install APK**. The cable-pull runs during the APK transfer and the card returns to **No Quest Connected**. |
| Device unauthorized (while connecting) | `mockPhase=unauthorized`, or connect with `mockNext=unauthorized`. **Connection Failed** plus the unauthorized message. |
| Device unauthorized (during install) | `mockInstall=unauthorized`, then click **Install APK**. The headset stays connected and the card shows `error: device unauthorized.` |
| USB interface locked | `mockPhase=usb-locked` |
| Connection cancelled | `mockPhase=cancelled`, or deny the visor prompt |
| Authorization timeout | `mockPhase=timeout` |
| Developer Mode / generic failure | `mockPhase=generic` |
| Package manager failure | `mockInstall=pm-failed`, then click **Install APK**. `INSTALL_FAILED_INVALID_APK`. |
| PC builder, not a one-click APK | `/ports/gta-sa-vr-quest?mockQuest=1&mockPhase=connected&mockGame=absent`. **Automated PC Builder Required**. After `mockGame=installed`, the same title follows the send-files / ready rules. |
| Several campaigns | `/ports/lambda1vr?mockQuest=1&mockPhase=connected&mockGame=installed&mockFiles=present`. Each campaign tab can be verified on its own. |
| Uninstall prompt | On an installed game, click **Uninstall**. |
| Uninstall failure | Add `mockUninstall=fail`, open **Uninstall**, confirm. The headset error stays in the prompt. |
| File copy in progress | `mockGame=installed&mockFiles=missing&mockTransfer=hold`, then drop a file on the send-files box. |
| Launching | `mockGame=installed&mockFiles=present&mockLaunch=slow`, then click **Launch on Quest**. |
| Library on the home page | `/?mockQuest=1&mockPhase=connected&mockGame=installed` shows the **Library** banner and installed count. `mockGame=absent` shows 0 installed. |

Click **Connect Meta Quest via USB** with `mockNext=ok` to walk the happy path yourself: USB chooser, visor **Allow**, then the connected card. **Install APK** with `mockInstall=ok` plays download, transfer, and `pm install`, then marks that game installed. It does not download the real release. Games that need data land on the send-files box; QuestCraft and Iron Lung land on **Launch on Quest**.

## Game files

`mockGame=installed` puts every catalog package on the fake headset. `mockFiles=primary` (and `present`) writes the required filenames into each port's main folder. `mockFiles=alternate` writes those filenames into the alternate folder instead. `mockFiles=stray` writes only an unrelated text file, which does not count as ready. `mockFiles=missing` leaves storage empty, so the send-files box stays up. CitraVR, PPSSPP VR, and PrimedGun still become ready when their ROM folder is non-empty, including a stray file.

That is the same check the page uses after a real `ls` over ADB. It does not require the critical filenames from `portPackageMap` to be present; any file in the scanned folder counts.
