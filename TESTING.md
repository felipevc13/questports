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
| `mockNext` | `ok` (default), `picker-cancel`, `unauthorized`, `usb-locked`, `cancelled`, `timeout`, `generic` | What the next **Install on Quest** click does after the simulated USB prompt |
| `mockInstall` | `ok` (default), `hold-downloading`, `hold-pushing`, `hold-installing`, `hold-success`, `download-failed`, `storage`, `disconnect`, `unauthorized`, `pm-failed` | What the next **Install on Quest** click does once the headset is connected |
| `noWebUsb` | `1` | Pretend this browser has no WebUSB (`navigator.usb` missing or a non-secure page). Works without `mockQuest`. |
| `inApp` | `1` | Pretend this page is inside the QuestPorts Android app. Hides USB connect UI and installs through a mock bridge (download progress, then success). `QuestPortsApp/<version>` in the user-agent does the same with the real bridge. |
| `mockGame` | `absent` (default), `installed`, `outdated` | Whether every catalog package is on the headset, and whether `versionName` is older than the catalog |
| `mockFiles` | `missing` (default), `stray`, `primary`, `alternate`, `present` | `missing` leaves storage empty. `stray` puts only `unrelated-note.txt` in each scanned folder, so the send-files box stays up. `primary` and `present` place each game's required filenames in its main folder. `alternate` places them in the first real alternate folder, or the `/storage/emulated/0` alias when the game has no second folder. |
| `mockUninstall` | `ok` (default), `fail` | `pm uninstall` result |
| `mockTransfer` | `ok` (default), `hold` | Pause a drag-and-drop file copy mid-transfer |
| `mockLaunch` | `ok` (default), `slow` | Keep **Launching...** on screen long enough to see it |
| `mockSpeed` | `normal` (default), `instant` | Skip the short pauses between download, transfer, and `pm install` |
| `mockChrome` | `1` (default), `0` | Show or hide the panel |
| `mockFree` | omitted (88G free), `low` (32 MB), or a number of MB such as `200` | Free space `df` reports. `low` is too small for the simulated 8 MB APK plus spare room, so Install stops before the download. |
| `mockLength` | `known` (default), `missing` | `missing` omits Content-Length. The download meter shows received MB on a pulsing bar instead of a percent. |

You can also set the phase as the flag itself: `?mockQuest=connected` is the same as `?mockQuest=1&mockPhase=connected`. `mockPhase` wins if both are set.

Changing the panel writes these parameters into the address bar and rebuilds the fake headset. A refresh keeps the same state.

## Install-flow states

Open a port that has a direct APK button, for example Return to Castle Wolfenstein:

`/ports/rtcwquest`

| State | How to show it |
| --- | --- |
| No headset | `?mockQuest=1` (or `mockPhase=disconnected`). The navbar and the card say **No Quest connected**. That status is not a button. The card has one **Install on Quest** button. The first click opens **Before the USB prompt** (cable, Developer Mode, **Allow USB debugging**) and does not open the chooser until **Continue**. |
| USB steps already seen | After a successful connect, `localStorage` key `questports_usb_connected` is `1` and **Install on Quest** opens the chooser directly. **Show USB setup steps** opens the explainer again. |
| Unsupported browser | `mockPhase=unsupported`, or `?noWebUsb=1` with no mock headset. The install button is replaced by **One-click install needs Chrome or Edge on desktop or Android.** **Manual install** expands the APK download and the step-by-step guide. |
| USB permission prompt | `mockPhase=picker`. A simulated Chrome device chooser lists **Meta Quest**. The card asks you to select the Quest in the browser window. The amber headset banner stays hidden. **Cancel** returns to **No Quest connected** and shows one calm line: **No headset selected. Try again when ready.** with **Try again**. It is not repeated in the navbar. **Connect** continues to the visor step. |
| Authorizing / visor prompt | `mockPhase=authorizing`. Amber **Action Required inside Headset!** banner, navbar **Authorizing Quest...**, and a simulated **Allow USB debugging?** prompt. **Allow** connects. **Deny** shows the cancelled-by-headset error. |
| Connected, game not installed | `mockPhase=connected&mockGame=absent`. Green **Quest 3** pill (78% battery, 88G free). **Install on Quest**. Open the navbar pill for the storage and battery dropdown. |
| Scanning storage | `mockPhase=scanning&mockGame=installed&mockFiles=missing` on a game that needs files. The card stays on **Scanning...** because the fake `ls` does not return. |
| Downloading | Connected, game absent, `mockInstall=hold-downloading`, then click **Install on Quest**. The bar moves with bytes received (about 4 MB of 8 MB) and then holds. **Cancel** returns to **Install on Quest** with no error. The bar is a `progressbar` with a live status. |
| Download, size unknown | Add `mockLength=missing` to the downloading URL. The meter shows received MB and the bar pulses instead of freezing on a percent. |
| Transferring the APK | `mockInstall=hold-pushing`, then click **Install on Quest**. Holds on **Transferring APK**. **Cancel** deletes the partial temp APK and returns to the install button. |
| Installing | `mockInstall=hold-installing`, then click **Install on Quest**. Holds on **Installing APK package on Quest OS (pm install)...** at 90%. |
| Success message | `mockInstall=hold-success`, then click **Install on Quest**. Holds at 100% with **Successfully installed!** |
| Installed, nothing else to copy | `mockPhase=connected&mockGame=installed` on `/ports/iron-lung-vr` or `/ports/questcraft`. **Standalone Port Ready to Play!** and **Launch on Quest**. |
| Installed, external files missing | `mockPhase=connected&mockGame=installed&mockFiles=missing` on `/ports/rtcwquest`. **Drag & drop** send-files box. No **Launch on Quest**. |
| Installed, stray file only | `mockPhase=connected&mockGame=installed&mockFiles=stray` on `/ports/rtcwquest`. The send-files box stays up. **Launch on Quest** stays hidden. |
| Installed, required files in the main folder | `mockPhase=connected&mockGame=installed&mockFiles=primary` (or `present`) on `/ports/perfect-dark-vr`. **Ready to Play on Quest!**, **Verified on Quest**, and **Launch on Quest**. |
| Installed, required files in an alternate folder | `mockPhase=connected&mockGame=installed&mockFiles=alternate` on `/ports/questsam`. Same ready card. The detected path is the legacy folder, not the app-data folder. |
| Installed, external files present | `mockPhase=connected&mockGame=installed&mockFiles=present` on `/ports/rtcwquest`. **Ready to Play on Quest!**, **Verified on Quest**, and **Launch on Quest**. |
| Update available | `mockPhase=connected&mockGame=outdated&mockFiles=present`. Badge **Update available** and **Update to …**. |
| Download failed | `mockInstall=download-failed`, then click **Install on Quest**. **Installation Issue: Failed to download APK: …** |
| Not enough storage before download | `mockFree=low`, then click **Install on Quest**. A message names how much is needed and how much is free. The download does not start. |
| Not enough storage at pm install | `mockInstall=storage`, then click **Install on Quest**. The storage meter drops to **184M free / 99%**. That still fits the simulated APK plus margin, so the pre-check allows it and install ends with `INSTALL_FAILED_INSUFFICIENT_STORAGE`. |
| Reinstall confirm | On an installed game, click **Reinstall**. The dialog warns that uninstall deletes Android/data for that package. **Install over it (keep data)** uses `pm install -r`. **Uninstall and reinstall** removes the package first. |
| Disconnect mid-install | `mockInstall=disconnect`, then click **Install on Quest**. The cable-pull runs during the APK transfer and the card returns to **No Quest connected**. |
| Device unauthorized (while connecting) | `mockPhase=unauthorized`, or connect with `mockNext=unauthorized`. **Connection Failed** plus the unauthorized message. |
| Device unauthorized (during install) | `mockInstall=unauthorized`, then click **Install on Quest**. The headset stays connected and the card shows `error: device unauthorized.` |
| USB interface locked | `mockPhase=usb-locked` |
| Connection cancelled | `mockPhase=cancelled`, or deny the visor prompt |
| Authorization timeout | `mockPhase=timeout` |
| Developer Mode / generic failure | `mockPhase=generic` |
| Package manager failure | `mockInstall=pm-failed`, then click **Install on Quest**. `INSTALL_FAILED_INVALID_APK`. |
| PC builder, not a one-click APK | `/ports/gta-sa-vr-quest?mockQuest=1&mockPhase=connected&mockGame=absent`. **Automated PC Builder Required**. After `mockGame=installed`, the same title follows the send-files / ready rules. |
| Several campaigns | `/ports/lambda1vr?mockQuest=1&mockPhase=connected&mockGame=installed&mockFiles=present`. Each campaign tab can be verified on its own. |
| Uninstall prompt | On an installed game, click **Uninstall**. |
| Uninstall failure | Add `mockUninstall=fail`, open **Uninstall**, confirm. The headset error stays in the prompt. |
| File copy in progress | `mockGame=installed&mockFiles=missing&mockTransfer=hold`, then drop a file on the send-files box. **Cancel** stops the copy and leaves the send-files box up, with no error. |
| File copy, not enough space | `mockGame=installed&mockFiles=missing&mockFree=low`, then drop a file. The same needed-versus-available message shows, and nothing is copied. |
| Launching | `mockGame=installed&mockFiles=present&mockLaunch=slow`, then click **Launch on Quest**. |
| Library on the home page | `/?mockQuest=1&mockPhase=connected&mockGame=installed` shows the **Library** banner and installed count. `mockGame=absent` shows 0 installed. |

Click **Install on Quest** with `mockNext=ok`. The first time, **Continue** on the USB steps opens the chooser. **Allow** on the visor finishes the connection and that same step keeps going into the install. A later visit skips the steps: **Install on Quest** opens the chooser, then installs after **Allow**. `mockInstall=ok` plays download, transfer, and `pm install`, then marks that game installed. It does not download the real release. Games that need data land on the send-files box; QuestCraft and Iron Lung land on **Launch on Quest**.

## Game files

`mockGame=installed` puts every catalog package on the fake headset. `mockFiles=primary` (and `present`) writes the required filenames into each port's main folder. `mockFiles=alternate` writes those filenames into the alternate folder instead. `mockFiles=stray` writes only an unrelated text file, which does not count as ready. `mockFiles=missing` leaves storage empty, so the send-files box stays up.

That is the same check the page uses after a real `ls` over ADB. A folder counts as ready only when its required filenames or accepted ROM extensions are present. CitraVR, PPSSPP VR, and PrimedGun follow that rule: a stray text file stays on the send-files box, and a real ROM shows Ready and Launch.

| What you want to see | Open |
| --- | --- |
| PrimedGun stray file, send-files stays up | `/ports/primedgun?mockQuest=1&mockPhase=connected&mockGame=installed&mockFiles=stray&mockSpeed=instant&mockChrome=0` |
| PrimedGun disc image, Ready and Launch | `/ports/primedgun?mockQuest=1&mockPhase=connected&mockGame=installed&mockFiles=primary&mockSpeed=instant&mockChrome=0` |
