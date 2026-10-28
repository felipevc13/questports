<template>
  <div v-if="port" class="mx-auto w-full min-w-0 max-w-[1720px] space-y-6 px-4 py-4 sm:px-6 md:py-6 lg:px-10">
    <!-- Breadcrumb & Top Bar -->
    <div class="flex min-w-0 items-center justify-between gap-2 border-b border-border/50 pb-2 text-xs text-muted-foreground">
      <NuxtLink to="/" class="inline-flex min-h-11 shrink-0 items-center gap-1.5 font-medium transition-colors hover:text-foreground md:min-h-0">
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span class="md:hidden">Back</span>
        <span class="hidden md:inline">Back to Database</span>
      </NuxtLink>

      <div class="flex min-w-0 items-center gap-2 md:gap-3">
        <a
          v-if="port.github_url"
          :href="port.github_url"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex min-h-11 items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted/50 md:min-h-0"
          @click="trackGithub"
        >
          <svg class="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
          <span>GitHub</span>
        </a>
        <span class="hidden truncate font-mono text-muted-foreground/80 sm:inline">ID: {{ port.slug }}</span>
      </div>
    </div>

    <!-- Header Section (Title & Meta) -->
    <div class="space-y-2">
      <div class="flex flex-wrap items-center gap-2">
        <NuxtLink
          :to="`/?cat=${encodeURIComponent(port.category)}`"
          class="inline-flex min-h-11 items-center rounded border border-border bg-secondary px-2 py-0.5 font-mono text-xs uppercase text-secondary-foreground transition-colors hover:text-primary hover:underline md:min-h-0"
        >
          {{ formatCategory(port.category) }}
        </NuxtLink>
        <span
          :class="port.status === 'released' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'"
          class="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono border"
        >
          ● {{ formatStatus(port.status) }}
        </span>
        <span class="inline-flex items-center px-2 py-0.5 rounded border border-border text-xs font-mono text-muted-foreground">
          {{ isDirectApkOnly ? 'Zero PC Required' : 'Standalone VR' }}
        </span>
        <PortVersion
          v-if="catalogVersion"
          :version="port.latest_version"
          class="rounded border border-primary/20 bg-primary/10 px-2 py-0.5 text-xs text-primary"
        />
      </div>

      <ul
        v-if="detailHeadsets.length"
        class="m-0 flex list-none flex-wrap gap-1 p-0"
        aria-label="Supported headsets"
      >
        <li
          v-for="headset in detailHeadsets"
          :key="headset"
          class="inline-flex items-center rounded border border-border px-2 py-0.5 font-mono text-xs text-muted-foreground"
        >
          {{ headset }}
        </li>
      </ul>

      <div class="flex min-w-0 flex-col justify-between gap-2 sm:flex-row sm:items-baseline">
        <h1 class="min-w-0 break-words text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
          {{ port.title }}
        </h1>
        <div class="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground sm:text-sm">
          <span>Developed by</span>
          <NuxtLink
            :to="`/?dev=${encodeURIComponent(port.developer)}`"
            class="inline-flex min-h-11 items-center font-semibold text-foreground transition-colors hover:text-primary hover:underline md:min-h-0"
          >
            {{ port.developer }}
          </NuxtLink>
          <a
            v-if="port.developer_url"
            :href="port.developer_url"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex min-h-11 items-center text-xs text-primary hover:underline md:min-h-0 md:ml-1"
          >
            Official Page ↗
          </a>
        </div>
      </div>

      <!-- Port Short Description / Tagline -->
      <p class="max-w-4xl pt-0.5 text-sm leading-relaxed text-muted-foreground line-clamp-3 md:line-clamp-none">
        {{ port.short_description }}
      </p>
    </div>

    <!-- HERO SPLIT SECTION (Trailer/Media on Left, Action Hub on Right) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- LEFT HERO: Media Player + Feature Compatibility Matrix (7 Cols). Below lg the install card is first. -->
      <div class="order-2 space-y-3 lg:order-1 lg:col-span-7">
        <div
          class="relative w-full aspect-video rounded-xl overflow-hidden border border-border bg-black shadow-2xl"
          @mouseenter="armDetailPreview"
          @mouseleave="stopDetailPreview"
          @focusin="armDetailPreview"
          @focusout="stopDetailPreview"
          :tabindex="detailPreviewSource ? 0 : undefined"
        >
          <video
            v-if="detailPreviewPlaying && detailPreviewSource"
            ref="detailPreviewVideo"
            :src="detailPreviewSource"
            muted
            loop
            playsinline
            preload="none"
            class="h-full w-full object-cover"
            data-testid="detail-preview-video"
            @play="onDetailPreviewPlaying"
          />
          <iframe
            v-else-if="youtubeActive && youtubeClip"
            :src="youtubeClip.embed"
            title="Gameplay / Devlog Video"
            class="w-full h-full"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
          <button
            v-else-if="youtubeClip"
            type="button"
            data-testid="youtube-lite"
            class="absolute inset-0 h-full w-full cursor-pointer"
            :aria-label="`Play ${port.title} gameplay video`"
            @click="playYoutube"
          >
            <img
              :src="youtubeClip.poster"
              :alt="`${port.title} gameplay`"
              width="480"
              height="360"
              class="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <span class="absolute inset-0 flex items-center justify-center bg-black/25">
              <span class="flex h-16 w-16 items-center justify-center rounded-full border border-white/25 bg-black/80 text-white shadow-lg">
                <svg class="ml-1 h-7 w-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </span>
            </span>
          </button>
          <img
            v-else
            :src="coverSrc"
            :alt="port.title"
            width="1280"
            height="720"
            class="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>

        <PortFeaturePanel :port="port" />
      </div>

      <!-- RIGHT HERO: Unified Smart Action Card (5 Cols) -->
      <div id="install-card" class="order-1 space-y-4 rounded-xl border border-border bg-card p-4 shadow-xl md:p-5 lg:order-2 lg:col-span-5">
        <!-- Headset connection status. Not an install button. Hidden inside the native app. -->
        <div v-if="!inApp" class="flex items-center justify-between pb-3 border-b border-border">
          <div class="flex items-center gap-2" role="status" aria-live="polite" data-testid="port-quest-status">
            <span
              class="w-2.5 h-2.5 rounded-full"
              :class="isQuestConnected ? 'bg-emerald-400 animate-pulse' : connectChrome.showHeadsetBanner ? 'bg-amber-400 animate-pulse' : 'bg-zinc-500'"
            ></span>
            <span class="text-xs font-semibold text-foreground">
              {{ headsetStatusLabel }}
            </span>
          </div>
          <span v-if="isQuestConnected" class="text-xs font-mono text-muted-foreground">
            {{ questDeviceInfoText }}
          </span>
          <span v-else-if="connectChrome.showHeadsetBanner" class="text-xs text-amber-400 font-mono flex items-center gap-1.5">
            <svg class="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <span>Waiting for visor...</span>
          </span>
          <button
            v-else-if="showUsbStepsLink"
            type="button"
            data-testid="show-usb-steps"
            class="inline-flex min-h-11 items-center text-[11px] font-medium text-muted-foreground underline hover:text-foreground md:min-h-0"
            @click="requestUsbPrepAgain"
          >
            Show USB setup steps
          </button>
        </div>

        <AppBridgeInstall
          v-if="inApp"
          :key="port.slug"
          :slug="port.slug"
          :download-url="port.port_download_url"
          :github-url="port.github_url"
          :package-name="currentPackageConfig?.packageName || null"
          :latest-version="port.latest_version"
          :needs-game-files="!isPcBuilderRequired && !isDirectApkOnly && !patchOnlyGuide && !pcPatchCard"
          :pc-builder="isPcBuilderRequired"
        />

        <!--
          The site Step 2 block (path, Copy, target folder, required files) is
          the WebUSB install flow below. The native app has no folder scan and
          no drop zone, so each campaign gets the same manual-copy card here.
        -->
        <div
          v-if="inApp && manualCopyCampaigns.length"
          data-testid="app-game-data"
          class="space-y-3 rounded-lg border border-border/80 bg-muted/20 p-3"
        >
          <div class="flex items-center gap-2">
            <span class="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 font-mono text-xs font-bold text-primary">2</span>
            <span class="text-xs font-bold text-foreground">{{ step2Title }}</span>
          </div>
          <p class="text-xs leading-relaxed text-muted-foreground">
            {{ languageFolders ? 'Copy one language. English is the USA discs.' : (manualCopyCampaigns.length > 1 ? 'Each campaign has its own folder. Copy the files from a PC.' : 'Copy these files from a PC.') }}
          </p>
          <div
            v-for="campaign in manualCopyCampaigns"
            :key="campaign.id"
            data-testid="campaign-copy"
            class="space-y-1.5"
          >
            <div v-if="manualCopyCampaigns.length > 1" class="flex min-w-0 flex-wrap items-center gap-1.5">
              <span class="min-w-0 text-xs font-bold leading-snug text-foreground">{{ campaign.name }}</span>
              <span
                class="campaign-chip"
                :class="campaign.isBase ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'"
              >
                {{ campaign.badge }}
              </span>
            </div>
            <div class="flex items-center justify-between gap-2 rounded border border-border/70 bg-black/40 p-2 font-mono text-xs">
              <div class="flex min-w-0 items-center gap-1.5">
                <svg class="h-3.5 w-3.5 shrink-0 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                <span data-testid="campaign-copy-path" class="min-w-0 break-all font-bold text-primary">{{ campaign.fullPath }}</span>
              </div>
              <button
                type="button"
                data-testid="campaign-copy-button"
                class="inline-flex min-h-11 shrink-0 items-center font-mono text-xs text-muted-foreground underline md:min-h-0"
                @click="copyDestinationPath(campaign.fullPath, campaign.id)"
              >
                {{ copiedCampaignId === campaign.id ? 'Copied!' : 'Copy' }}
              </button>
            </div>
            <div class="flex flex-wrap items-center gap-x-2 gap-y-1 rounded border border-border/50 bg-muted/40 px-2 py-1 text-xs">
              <span class="text-muted-foreground">Target Folder:</span>
              <span data-testid="campaign-copy-folder" class="campaign-chip border border-primary/30 bg-primary/15 font-bold text-primary">
                {{ campaign.folder }}/
              </span>
              <span data-testid="campaign-copy-files" class="min-w-0 break-words font-mono leading-snug text-muted-foreground">
                {{ campaign.exampleFiles }}
              </span>
            </div>
          </div>
        </div>

        <div
          v-else-if="inApp && showAppGameDataGuide"
          data-testid="app-game-data-guide"
          class="space-y-1.5 rounded-lg border border-border/80 bg-muted/20 p-3"
        >
          <p class="text-xs leading-relaxed text-muted-foreground">
            Copy the game files using the installation guide. This page does not have one folder it can fill for you.
          </p>
          <a
            href="#install-guide"
            class="inline-flex min-h-11 items-center text-[11px] font-semibold text-primary hover:underline md:min-h-0"
          >
            Open the installation guide
          </a>
        </div>

        <div v-if="!inApp" class="space-y-3 pt-1">
          <div
            v-if="largePortMessage && !isPcBuilderRequired"
            data-testid="apk-too-large"
            class="space-y-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-[11px] leading-relaxed text-amber-50"
          >
            <p>{{ largePortMessage }}</p>
            <a
              v-if="port.port_download_url"
              :href="port.port_download_url"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="apk-too-large-download"
              class="inline-flex min-h-11 items-center font-mono text-[10px] text-primary underline md:min-h-0"
              @click="trackManualDownload"
            >
              Download APK directly ↗
            </a>
          </div>
          <div
            v-if="showUsbPrep && !questBrowser"
            data-testid="usb-prep"
            class="space-y-3 rounded-lg border border-border/80 bg-muted/20 p-3 md:p-4"
            role="region"
            aria-labelledby="usb-prep-title"
          >
            <div>
              <h2 id="usb-prep-title" class="text-xs font-bold text-foreground">Before the USB prompt</h2>
              <p class="text-[11px] text-muted-foreground leading-relaxed mt-1">
                The browser will ask which USB device to use. Do this first:
              </p>
            </div>
            <ol class="space-y-1.5">
              <li
                v-for="(step, index) in USB_PREP_STEPS"
                :key="step"
                class="flex items-start gap-2 text-[11px] text-foreground"
              >
                <span class="w-4 h-4 rounded-full bg-primary/20 text-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{{ index + 1 }}</span>
                <span>{{ step }}</span>
              </li>
            </ol>
            <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
              <button
                ref="usbPrepContinueRef"
                type="button"
                data-testid="usb-prep-continue"
                class="min-h-11 w-full rounded-lg bg-primary px-3 py-3 text-xs font-semibold text-primary-foreground transition-all hover:bg-primary/90 sm:w-auto sm:py-2 md:min-h-0"
                @click="beginInstall({ skipPrep: true })"
              >
                Continue
              </button>
              <button
                type="button"
                class="min-h-11 w-full rounded-lg px-3 py-3 text-xs text-muted-foreground hover:text-foreground sm:w-auto sm:py-2 md:min-h-0"
                @click="dismissUsbPrep"
              >
                Not now
              </button>
            </div>
          </div>

          <!-- RSA prompt is on the headset. Text only: a drawn Allow button gets tapped. -->
          <div
            v-else-if="!questBrowser && connectChrome.showHeadsetBanner"
            data-testid="authorize-prompt"
            class="space-y-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-left text-xs"
            role="status"
          >
            <p class="text-[11px] font-semibold leading-relaxed text-amber-100">
              {{ AUTHORIZE_PROMPT_LEAD }}
            </p>
            <div
              v-if="showAuthorizeWaitHint"
              data-testid="authorize-still-waiting"
              class="space-y-2 border-t border-amber-500/20 pt-2"
              aria-live="polite"
            >
              <p class="text-xs font-semibold text-foreground">{{ AUTHORIZE_STILL_WAITING_TITLE }}</p>
              <ul class="space-y-1">
                <li
                  v-for="step in AUTHORIZE_STILL_WAITING_STEPS"
                  :key="step"
                  class="flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground"
                >
                  <span class="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/70" aria-hidden="true"></span>
                  <span>{{ step }}</span>
                </li>
              </ul>
              <button
                type="button"
                data-testid="authorize-retry"
                class="inline-flex min-h-11 items-center rounded bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-all hover:bg-primary/90 md:min-h-0"
                @click="retryFromAuthorize"
              >
                Try again
              </button>
            </div>
            <div class="flex items-center justify-between pt-1">
              <span class="font-mono text-[10px] text-muted-foreground">Waiting for the headset prompt…</span>
              <button
                type="button"
                class="cursor-pointer text-[11px] font-medium text-rose-400 underline hover:text-rose-300"
                @click="questAdb.cancelConnect"
              >
                Cancel
              </button>
            </div>
          </div>

          <p
            v-else-if="!questBrowser && connectChrome.showPickerHint"
            data-testid="usb-picker-hint"
            role="status"
            class="p-3 rounded-lg bg-muted/40 border border-border text-[11px] text-muted-foreground leading-relaxed"
          >
            {{ QUEST_PICKER_HINT }}
          </p>

          <div
            v-else-if="showChooserHelp"
            data-testid="chooser-dismissed"
            role="status"
            class="p-3.5 rounded-lg bg-muted/40 border border-border text-xs text-left space-y-2"
          >
            <p class="text-xs font-semibold text-foreground">{{ CHOOSER_DISMISSED_TITLE }}</p>
            <ul class="space-y-1">
              <li
                v-for="step in CHOOSER_DISMISSED_STEPS"
                :key="step"
                class="flex items-start gap-2 text-[11px] text-muted-foreground leading-relaxed"
              >
                <span class="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/70" aria-hidden="true"></span>
                <span>{{ step }}</span>
              </li>
            </ul>
            <button
              type="button"
              data-testid="chooser-retry"
              class="inline-flex min-h-11 items-center rounded bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-all hover:bg-primary/90 md:min-h-0"
              @click="retryUsbConnect"
            >
              Try again
            </button>
          </div>

          <div
            v-else-if="showUsbLocked"
            data-testid="usb-locked"
            role="alert"
            class="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-left space-y-2 animate-in fade-in duration-200"
          >
            <div class="flex items-start justify-between gap-2">
              <p class="font-semibold text-amber-200">{{ USB_LOCKED_TITLE }}</p>
              <button
                type="button"
                data-testid="usb-locked-dismiss"
                class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-lg leading-none text-amber-100/80 hover:bg-amber-500/10 hover:text-amber-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:h-8 md:w-8"
                :aria-label="DISMISS_CONNECTION_ERROR_LABEL"
                @click="questAdb.dismissConnectionError()"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <p class="text-[11px] text-amber-100/90 leading-relaxed">{{ USB_LOCKED_BODY }}</p>
            <p class="text-[11px] text-muted-foreground leading-relaxed">
              {{ USB_LOCKED_PLATFORM }}
              <code class="rounded bg-black/40 px-1 py-0.5 font-mono text-[10px] text-foreground">{{ USB_LOCKED_COMMAND }}</code>.
              {{ USB_LOCKED_AFTER }}
            </p>
            <button
              type="button"
              data-testid="usb-locked-retry"
              class="inline-flex min-h-11 items-center rounded bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-all hover:bg-primary/90 md:min-h-0"
              @click="retryUsbConnect"
            >
              Try again
            </button>
          </div>

          <div
            v-else-if="showOtherConnectionError"
            data-testid="connect-failed"
            role="alert"
            class="space-y-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3.5 text-left text-xs"
          >
            <div class="flex items-start justify-between gap-2">
              <div class="flex items-center gap-1.5 font-semibold text-destructive">
                <svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{{ authorizeConnectionError ? AUTHORIZE_STILL_WAITING_TITLE : 'Connection Failed' }}</span>
              </div>
              <button
                type="button"
                data-testid="connect-error-dismiss"
                class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-lg leading-none text-destructive/80 hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:h-8 md:w-8"
                :aria-label="DISMISS_CONNECTION_ERROR_LABEL"
                @click="questAdb.dismissConnectionError()"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <p class="text-[11px] leading-relaxed text-muted-foreground">
              {{ questAdb.connectionError.value }}
            </p>
            <ul data-testid="connect-failure-steps" class="space-y-1">
              <li
                v-for="step in connectionFailureSteps"
                :key="step"
                class="flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground"
              >
                <span class="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/70" aria-hidden="true"></span>
                <span>{{ step }}</span>
              </li>
            </ul>
            <div class="pt-1">
              <button
                type="button"
                data-testid="connect-retry"
                class="inline-flex min-h-11 items-center rounded bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-all hover:bg-primary/90 md:min-h-0"
                @click="retryUsbConnect"
              >
                Try again
              </button>
            </div>
          </div>

          <!-- APK not installed yet. One install action, whether or not the headset is connected. -->
          <div v-if="!isApkInstalled" class="space-y-3 rounded-lg border border-border/80 bg-muted/20 p-3 md:p-4">
            <template v-if="pcPatchCard">
              <PcPrepCard
                :title="pcPatchCard.title"
                :tag="pcPatchCard.tag"
                :body="pcPatchCard.body"
                :href="pcPatchCard.href"
                :button-label="pcPatchCard.buttonLabel"
                root-test-id="pc-patch-card"
                test-id="pc-patch-instructions"
                @open="trackGithub"
              />
              <QuestBrowserNotice
                v-if="questBrowser"
                :download-url="port.port_download_url"
                :download-source="port.port_download_source"
                :needs-game-files="!isDirectApkOnly"
              />
            </template>

            <PatchOnlyInstall v-else-if="patchOnlyGuide" :guide="patchOnlyGuide" />

            <!-- Case A: PC Builder Required (GTA SA / Vice City) -->
            <template v-else-if="isPcBuilderRequired">
              <PcPrepCard
                title="Step 1: Automated PC Builder Required"
                tag="PC Script"
                body="Due to Rockstar Games copyright, the VR mod cannot be distributed as a pre-compiled APK. An automated PC installer merges the VR injector with your legally purchased Google Play APK and installs it to your Quest via USB."
                :href="port.port_download_url || port.github_url || '#'"
                button-label="Open PC Builder & Instructions (GitHub)"
                test-id="pc-builder-link"
                @open="trackPcBuilderLink"
              />

              <QuestBrowserNotice
                v-if="questBrowser"
                :download-url="port.port_download_url"
                :download-source="port.port_download_source"
                :needs-game-files="!isDirectApkOnly"
              />
            </template>

            <!-- Case B: Standard 1-Click APK Sideload -->
            <template v-else>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="w-5 h-5 rounded-full bg-primary/20 text-primary font-mono text-xs font-bold flex items-center justify-center">1</span>
                  <span class="text-xs font-bold text-foreground">Step 1: Install Port APK</span>
                </div>
                <span v-if="isQuestConnected" class="text-[11px] font-mono text-primary">WebADB Ready</span>
              </div>

              <div
                v-if="spaceNotice || questAdb.installSpaceWarning.value"
                data-testid="space-notice"
                class="p-3 rounded-lg border text-[11px] leading-relaxed"
                :class="spaceNoticeKind === 'block'
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-100'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-50'"
              >
                {{ spaceNotice || questAdb.installSpaceWarning.value }}
              </div>

              <div :class="showSendToQuest ? 'flex flex-col gap-2' : 'contents'">
                <div :class="showSendToQuest ? 'order-2 flex flex-col gap-3 md:order-1' : 'contents'">
              <QuestBrowserNotice
                v-if="questBrowser"
                :download-url="port.port_download_url"
                :download-source="port.port_download_source"
                :needs-game-files="!isDirectApkOnly"
              />

              <UnsupportedBrowserNotice v-else-if="installSupport === 'unsupported'">
                <DirectQuestInstall
                  :download-url="port.port_download_url"
                  :download-source="port.port_download_source"
                  :needs-game-files="!isDirectApkOnly"
                />
                <button
                  type="button"
                  data-testid="manual-install-toggle"
                  class="inline-flex min-h-11 items-center text-[11px] font-semibold text-primary hover:underline md:min-h-0"
                  :aria-expanded="manualInstallOpen"
                  @click="manualInstallOpen = !manualInstallOpen"
                >
                  {{ manualInstallOpen ? 'Hide manual install' : 'Manual install' }}
                </button>
                <div v-if="manualInstallOpen" data-testid="manual-install" class="space-y-1.5 text-[11px]">
                  <a
                    v-if="port.port_download_url"
                    :href="port.port_download_url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex min-h-11 items-center text-primary underline md:min-h-0"
                    @click="trackManualDownload"
                  >
                    Download the APK ({{ port.port_download_source || 'SideQuest' }})
                  </a>
                  <a href="#install-guide" class="inline-flex min-h-11 items-center text-primary underline md:min-h-0">
                    Step-by-step installation guide
                  </a>
                </div>
              </UnsupportedBrowserNotice>

              <p v-else-if="installSupport === 'unknown'" class="text-[11px] text-muted-foreground">
                Checking browser support…
              </p>

              <div v-else-if="!isInstallingApk" class="space-y-2">
                <button
                  v-if="showPrimaryInstall"
                  type="button"
                  data-testid="install-on-quest"
                  @click="beginInstall()"
                  :class="showSendToQuest ? INSTALL_BUTTON_CLASS_WITH_SEND : INSTALL_BUTTON_CLASS"
                >
                  <svg v-if="showSendToQuest" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 19a1 1 0 0 1-1-1v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a1 1 0 0 1-1 1z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 21v-2" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14V6.5a1 1 0 0 0-7 0v11a1 1 0 0 1-7 0V10" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21v-2" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5V3" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 10a2 2 0 0 1-2-2V6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2a2 2 0 0 1-2 2z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 5V3" />
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>{{ showSendToQuest ? INSTALL_VIA_USB_LABEL : INSTALL_ACTION_LABEL }}</span>
                </button>
              </div>

              <TransferProgress
                v-else
                :message="questAdb.installProgress.value.message || 'Installing on Quest...'"
                :percent="questAdb.installProgress.value.percent"
                :indeterminate="Boolean(questAdb.installProgress.value.indeterminate)"
                :received-label="questAdb.installProgress.value.receivedLabel"
                :show-cancel="canCancelInstall"
                :locked-note="installLockedNote"
                @cancel="cancelApkInstall"
              />

              <!-- Installation Error Message with Retry / Bypass -->
              <div v-if="apkInstallError" class="p-2.5 rounded bg-rose-500/10 border border-rose-500/30 text-[11px] text-rose-300 space-y-1.5 animate-in fade-in duration-200">
                <div class="flex items-center justify-between">
                  <span class="font-semibold">Installation Issue:</span>
                  <button @click="apkInstallError = null" class="text-muted-foreground hover:text-foreground cursor-pointer">✕</button>
                </div>
                <p>{{ apkInstallError }}</p>
                <div class="flex items-center justify-between pt-1 font-mono text-[10px]">
                  <a :href="port.port_download_url || '#'" target="_blank" rel="noopener noreferrer" class="underline text-primary" @click="trackManualDownload">Download APK directly ↗</a>
                </div>
              </div>
                </div>
                <SendToQuest
                  v-if="showSendToQuest"
                  class="order-1 md:order-2"
                  :slug="port.slug"
                  :title="port.title"
                  :version="catalogVersion"
                />
              </div>
            </template>
          </div>

          <!-- STATE 3: APK INSTALLED -->
          <div v-else class="space-y-3">
            <QuestBrowserNotice
                v-if="questBrowser"
                :download-url="port.port_download_url"
                :download-source="port.port_download_source"
                :needs-game-files="!isDirectApkOnly"
              />
            <!-- Installed Badge -->
            <div
              data-testid="installed-status"
              class="space-y-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3"
            >
              <div class="flex items-center gap-2">
                <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">✓</span>
                <span class="min-w-0 flex-1 whitespace-nowrap text-xs font-semibold text-emerald-400">
                  {{ isApkOutdated ? 'Update available' : 'APK Installed on Quest!' }}
                </span>
                <span
                  v-if="isDetectedOnConnectedQuest"
                  class="shrink-0 whitespace-nowrap rounded bg-emerald-500/15 px-1.5 py-0.5 font-mono text-[10px] font-normal text-emerald-300/80"
                  title="Detected via ADB"
                >
                  via ADB
                </span>
              </div>
              <p class="text-[11px] leading-relaxed text-muted-foreground">
                {{ installedStatusDetail }}
              </p>
              <div class="flex items-center gap-2">
                <button
                  v-if="!patchOnlyGuide && !pcPatchCard && !questBrowser && !largePortMessage && isApkOutdated && !isInstallingApk && !installFlowChrome"
                  type="button"
                  @click="beginInstall()"
                  class="inline-flex min-h-11 flex-1 items-center justify-center whitespace-nowrap rounded-lg bg-amber-500 px-3 text-xs font-semibold text-black hover:bg-amber-400"
                  title="Installs over the current app with pm install -r and keeps data"
                >
                  Update to {{ catalogVersion }}
                </button>
                <button
                  v-else-if="!patchOnlyGuide && !pcPatchCard && !questBrowser && !largePortMessage && !isInstallingApk && !installFlowChrome"
                  type="button"
                  @click="openReinstallPrompt"
                  class="inline-flex min-h-11 flex-1 items-center justify-center whitespace-nowrap rounded-lg border border-border bg-muted/40 px-3 text-xs font-semibold text-foreground hover:bg-muted"
                >
                  Reinstall
                </button>
                <button
                  type="button"
                  @click="showUninstallPrompt = !showUninstallPrompt"
                  class="inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 text-xs font-semibold text-rose-300 hover:bg-rose-500/20"
                  :title="isQuestConnected ? 'Uninstall APK directly from Meta Quest' : 'Reset installed status'"
                >
                  <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Uninstall</span>
                </button>
              </div>
              <SendToQuest
                v-if="showSendToQuest"
                :slug="port.slug"
                :title="port.title"
                :version="catalogVersion"
              />
            </div>

            <KofiTip surface="install_success" />

            <div
              v-if="spaceNotice || questAdb.installSpaceWarning.value"
              data-testid="space-notice"
              class="p-3 rounded-lg border text-[11px] leading-relaxed"
              :class="spaceNoticeKind === 'block'
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-100'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-50'"
            >
              {{ spaceNotice || questAdb.installSpaceWarning.value }}
            </div>

            <div
              v-if="isInstallingApk"
              class="p-3 rounded-lg bg-muted/20 border border-border/80"
            >
              <TransferProgress
                :message="questAdb.installProgress.value.message || 'Updating APK on Quest...'"
                :percent="questAdb.installProgress.value.percent"
                :indeterminate="Boolean(questAdb.installProgress.value.indeterminate)"
                :received-label="questAdb.installProgress.value.receivedLabel"
                :show-cancel="canCancelInstall"
                :locked-note="installLockedNote"
                @cancel="cancelApkInstall"
              />
            </div>

            <div
              v-if="showReinstallPrompt"
              data-testid="reinstall-confirm"
              class="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/40 text-xs space-y-2.5"
            >
              <div class="font-semibold text-amber-100">Reinstall {{ port.title }}?</div>
              <p class="text-[11px] text-muted-foreground leading-relaxed">{{ reinstallCopy.lead }}</p>
              <p v-if="reinstallCopy.shared" class="text-[11px] text-foreground leading-relaxed">{{ reinstallCopy.shared }}</p>
              <p class="text-[11px] text-muted-foreground leading-relaxed">{{ reinstallCopy.keepData }}</p>
              <p v-if="reinstallError" class="text-[11px] text-rose-300 font-mono">{{ reinstallError }}</p>
              <div class="flex items-center justify-end gap-2 pt-0.5 flex-wrap">
                <button
                  type="button"
                  @click="showReinstallPrompt = false"
                  :disabled="isUninstallingApp"
                  class="px-2.5 py-1 text-[11px] font-medium rounded border border-border/80 bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  @click="installKeepingData"
                  :disabled="isUninstallingApp || isInstallingApk"
                  class="px-2.5 py-1 text-[11px] font-semibold rounded bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer disabled:opacity-50"
                >
                  Install over it (keep data)
                </button>
                <button
                  type="button"
                  data-testid="reinstall-confirm-wipe"
                  @click="executeReinstall"
                  :disabled="isUninstallingApp || isInstallingApk"
                  class="px-3 py-1 text-[11px] font-semibold rounded bg-rose-600 hover:bg-rose-500 text-white cursor-pointer disabled:opacity-50"
                >
                  {{ isUninstallingApp ? 'Removing...' : 'Uninstall and reinstall' }}
                </button>
              </div>
            </div>

            <div
              v-if="apkInstallError && isApkInstalled"
              class="p-2.5 rounded bg-rose-500/10 border border-rose-500/30 text-[11px] text-rose-300 space-y-1.5"
            >
              <div class="flex items-center justify-between">
                <span class="font-semibold">Update Issue:</span>
                <button @click="apkInstallError = null" class="text-muted-foreground hover:text-foreground cursor-pointer">✕</button>
              </div>
              <p>{{ apkInstallError }}</p>
            </div>

            <!-- Uninstall Confirmation Prompt -->
            <div
              v-if="showUninstallPrompt"
              class="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs space-y-2.5 animate-in fade-in duration-200"
            >
              <div class="flex items-start justify-between gap-2">
                <div class="space-y-1">
                  <div class="font-semibold text-rose-300 flex items-center gap-1.5">
                    <svg class="w-4 h-4 text-rose-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>Uninstall {{ port.title }}?</span>
                  </div>
                  <p class="text-[11px] text-muted-foreground leading-relaxed">
                    <template v-if="isQuestConnected && getInstalledPackageName()">
                      This will run <code>pm uninstall {{ getInstalledPackageName() }}</code> on your connected Meta Quest to completely remove the application.
                    </template>
                    <template v-else-if="isQuestConnected">
                      Quest is connected, but package name was not detected in active packages list. This will reset the card status.
                    </template>
                    <template v-else>
                      Connect your Quest via USB to uninstall the package directly from headset storage, or click confirm to reset card status.
                    </template>
                  </p>
                  <p v-if="uninstallErrorMsg" class="text-[11px] text-rose-400 font-mono">
                    {{ uninstallErrorMsg }}
                  </p>
                </div>
              </div>
              <div class="flex items-center justify-end gap-2 pt-0.5">
                <button
                  @click="showUninstallPrompt = false"
                  :disabled="isUninstallingApp"
                  class="px-2.5 py-1 text-[11px] font-medium rounded border border-border/80 bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  @click="executeUninstallApp"
                  :disabled="isUninstallingApp"
                  class="px-3 py-1 text-[11px] font-semibold rounded bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm disabled:opacity-50"
                >
                  <svg v-if="isUninstallingApp" class="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>{{ isUninstallingApp ? 'Uninstalling...' : (isQuestConnected && getInstalledPackageName() ? 'Uninstall from Quest' : 'Confirm Reset') }}</span>
                </button>
              </div>
            </div>

            <!-- Standalone Direct APK: Ready to Play immediately -->
            <div
              v-if="isDirectApkOnly"
              class="p-5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3 animate-in fade-in duration-300"
            >
              <div class="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <div class="text-sm font-bold text-foreground">
                  Standalone Port Ready to Play!
                </div>
                <p class="text-[11px] text-muted-foreground max-w-xs mx-auto mt-1 leading-relaxed">
                  This game is completely self-contained and needs no external PC assets. Open <strong class="text-foreground">Unknown Sources</strong> on your headset and launch <span class="text-emerald-400 font-semibold">{{ port.title }}</span>!
                </p>
              </div>
              <button
                v-if="currentPackageConfig && questAdb.isConnected.value"
                @click="launchAppOnQuest"
                :disabled="isAppLaunching"
                class="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-900/30 transition-all cursor-pointer inline-flex items-center gap-1.5"
              >
                <svg v-if="isAppLaunching" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span v-else>🚀</span>
                <span>{{ isAppLaunching ? 'Launching...' : 'Launch on Quest' }}</span>
              </button>
            </div>

            <!-- Data Files / ROMs Box (For ports requiring assets) -->
            <div v-else-if="!patchOnlyGuide && !pcPatchCard" class="space-y-3 rounded-lg border border-border/80 bg-muted/20 p-3 md:p-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="w-5 h-5 rounded-full bg-primary/20 text-primary font-mono text-xs font-bold flex items-center justify-center">2</span>
                  <span class="text-xs font-bold text-foreground">{{ step2Title }}</span>
                </div>

                <!-- Multi-campaign install counter / storage status -->
                <div v-if="languageFolders" class="text-[11px] font-mono text-muted-foreground">
                  One language is enough
                </div>
                <div v-else-if="campaignList.length > 1" class="text-[11px] font-mono text-muted-foreground flex items-center gap-2">
                  <span v-if="isScanningGameFiles" class="flex items-center gap-1.5 text-primary">
                    <svg class="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    <span>Scanning Quest...</span>
                  </span>
                  <template v-else>
                    <span>Installed:</span>
                    <span
                      data-testid="install-part-count"
                      class="font-bold px-1.5 py-0.5 rounded border"
                      :class="installedCampaignsCount > 0 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-muted/60 text-foreground border-border'"
                    >
                      {{ installedCampaignsCount }} / {{ campaignList.length }}
                    </span>
                    <button
                      @click="scanCampaignFiles"
                      class="text-[10px] text-muted-foreground hover:text-foreground underline cursor-pointer"
                      title="Scan Quest storage for files"
                    >
                      Re-scan
                    </button>
                  </template>
                </div>

                <div v-else class="flex items-center gap-2">
                  <span v-if="isScanningGameFiles" class="flex items-center gap-1 text-[11px] font-mono text-primary">
                    <svg class="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    <span>Scanning...</span>
                  </span>
                  <button
                    v-else
                    @click="scanCampaignFiles"
                    class="text-[11px] font-mono text-muted-foreground hover:text-foreground underline cursor-pointer"
                    title="Scan Quest storage for files"
                  >
                    Re-scan Quest
                  </button>
                </div>
              </div>

              <!-- CAMPAIGN / EXPANSION SELECTOR TABS -->
              <div v-if="campaignList.length > 1" class="space-y-1.5 pt-1">
                <div class="flex items-center justify-between text-[11px]">
                  <span class="text-muted-foreground font-medium flex items-center gap-1">
                    <template v-if="languageFolders">Select language:</template>
                    <template v-else><span>🎮</span> Select Campaign or Expansion:</template>
                  </span>
                  <span class="text-[10px] text-muted-foreground/80 font-mono">
                    {{ languageFolders ? 'English is the USA discs' : 'Installs into separate subfolders' }}
                  </span>
                </div>
                <div class="grid grid-cols-1 gap-1.5">
                  <button
                    v-for="campaign in campaignList"
                    :key="campaign.id"
                    @click="selectCampaign(campaign.id)"
                    class="flex min-w-0 flex-col gap-1 rounded-lg border p-2 text-left transition-all cursor-pointer"
                    :class="currentCampaign?.id === campaign.id
                      ? 'bg-primary/10 border-primary text-foreground shadow-sm ring-1 ring-primary/40'
                      : 'bg-muted/30 border-border/70 text-muted-foreground hover:text-foreground hover:bg-muted/60'"
                  >
                    <div class="flex min-w-0 flex-wrap items-center gap-1.5">
                      <span class="min-w-0 break-words text-xs font-bold leading-snug" :class="currentCampaign?.id === campaign.id ? 'text-primary' : 'text-foreground'">
                        {{ campaign.name }}
                      </span>
                      <span
                        v-if="partState(campaign) === 'ready'"
                        class="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold leading-none text-emerald-400"
                        title="Campaign files are on the Quest"
                      >
                        ✓
                      </span>
                      <span
                        v-else-if="partState(campaign) === 'installed'"
                        class="campaign-chip bg-emerald-500/20 text-emerald-400"
                        title="Base game package is installed"
                      >
                        Installed
                      </span>
                      <span
                        v-else
                        class="campaign-chip"
                        :class="campaign.isBase ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'"
                      >
                        {{ campaign.badge }}
                      </span>
                    </div>
                    <div class="break-all font-mono text-xs leading-snug text-muted-foreground/80">
                      {{ campaign.folder }}/
                    </div>
                  </button>
                </div>
              </div>

              <!-- Destination folder path -->
              <div v-if="currentCampaign && currentDropPathClean" class="space-y-1.5">
                <div class="flex items-center justify-between gap-2 rounded border border-border/70 bg-black/40 p-2 font-mono text-xs">
                  <div class="flex min-w-0 items-center gap-1.5">
                    <svg class="h-3.5 w-3.5 shrink-0 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    <span class="min-w-0 break-all font-bold text-primary">{{ currentCampaign.fullPath }}</span>
                  </div>
                  <button
                    type="button"
                    class="inline-flex min-h-11 shrink-0 items-center font-mono text-xs text-muted-foreground underline hover:text-foreground md:min-h-0"
                    @click="copyDestinationPath(currentCampaign.fullPath, currentCampaign.id)"
                  >
                    {{ copiedCampaignId === currentCampaign.id ? 'Copied!' : 'Copy' }}
                  </button>
                </div>

                <!-- Explicit Target Folder Banner -->
                <div class="flex flex-wrap items-center gap-x-2 gap-y-1 rounded border border-border/50 bg-muted/40 px-2 py-1 text-xs">
                  <span class="font-medium text-muted-foreground">Target Folder:</span>
                  <span class="campaign-chip border border-primary/30 bg-primary/15 font-bold text-primary">
                    {{ currentCampaign.folder }}/
                  </span>
                  <span class="min-w-0 break-words font-mono leading-snug text-muted-foreground">
                    {{ currentCampaign.exampleFiles }}
                  </span>
                </div>
              </div>

              <!-- Dropzone / File Upload (Real Drag-and-Drop or Click) -->
              <div
                v-if="currentDropPathClean && !isCurrentCampaignTransferred"
                id="game-file-drop"
                @dragover.prevent
                @drop="handleDrop"
                @click="triggerFileInput"
                class="border-2 border-dashed border-border hover:border-primary/60 hover:bg-primary/5 rounded-lg p-5 text-center transition-all cursor-pointer group relative"
              >
                <!-- Hidden file picker for real files -->
                <input
                  ref="fileInputRef"
                  type="file"
                  multiple
                  class="hidden"
                  @change="handleFileInputChange"
                />

                <div v-if="!isTransferringFiles">
                  <svg class="w-7 h-7 text-muted-foreground group-hover:text-primary mx-auto mb-1.5 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <div class="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                    Drag & drop or click to choose <span class="text-primary font-bold underline decoration-primary/40 underline-offset-2">{{ currentCampaign?.folder }}</span> files
                  </div>
                  <div class="text-[11px] text-muted-foreground mt-0.5">
                    {{ currentCampaign?.instruction || 'Drop the required game folder or files directly into your Quest' }}
                  </div>
                  <div class="mt-2.5 flex items-center justify-center gap-2">
                    <span class="text-[10px] font-mono text-muted-foreground px-2 py-0.5 rounded bg-muted/60 border border-border">
                      Pushes directly to {{ currentCampaign?.fullPath }}
                    </span>
                  </div>
                </div>

                <div v-else class="py-1" @click.stop>
                  <TransferProgress
                    :message="fileTransferStatusMsg || `Copying files into /${currentCampaign?.folder}/...`"
                    :percent="fileTransferProgress"
                    :indeterminate="fileTransferIndeterminate"
                    :received-label="fileTransferReceived"
                    :show-cancel="true"
                    @cancel="cancelFileTransfer"
                  />
                </div>
              </div>

              <div
                v-else-if="currentCampaign && !currentDropPathClean && !isCurrentCampaignTransferred"
                data-testid="drop-zone-withheld"
                class="rounded-lg border border-border bg-muted/30 p-3 text-left"
              >
                <p class="text-[11px] leading-relaxed text-muted-foreground">
                  This destination is explained in the installation guide, so files are not copied from this page.
                </p>
                <a
                  href="#install-guide"
                  class="mt-1 inline-flex min-h-11 items-center text-[11px] font-semibold text-primary hover:underline md:min-h-0"
                >
                  Open the installation guide
                </a>
              </div>

              <div
                v-if="!isCurrentCampaignTransferred && currentDetectedCampaign?.confirmReason"
                class="p-3 rounded-lg border border-amber-500/40 bg-amber-500/10 text-left space-y-2"
              >
                <p class="text-[11px] text-foreground leading-relaxed">{{ confirmCopy }}</p>
                <button
                  type="button"
                  @click="confirmImportedFiles"
                  class="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-[11px] font-semibold cursor-pointer"
                >
                  I already imported the files
                </button>
              </div>

              <!-- TRIUMPHANT SUCCESS / READY TO PLAY CARD -->
              <div
                v-if="isCurrentCampaignTransferred"
                class="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3 animate-in fade-in duration-300"
              >
                <div class="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div class="text-sm font-bold text-foreground">
                    <span v-if="campaignList.length > 1">{{ currentCampaign?.name }} is </span>Ready to Play on Quest!
                  </div>

                  <!-- Headset verification banner -->
                  <div
                    v-if="currentDetectedCampaign?.exists"
                    class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono mt-1.5"
                  >
                    <span>✓ Verified on Quest</span>
                    <span v-if="currentDetectedCampaign?.fileCount">({{ currentDetectedCampaign.fileCount }} files detected)</span>
                  </div>
                  <div
                    v-else-if="currentCampaign && confirmedCampaigns[currentCampaign.id]"
                    class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-200 text-[10px] font-mono mt-1.5"
                  >
                    <span>Confirmed by you — not verified over USB</span>
                  </div>

                  <p class="text-[11px] text-muted-foreground max-w-xs mx-auto mt-1 leading-relaxed">
                    Put on your headset, open the App Library, select <strong class="text-foreground">Unknown Sources</strong>, and launch <span class="text-emerald-400 font-semibold">{{ port.title }}</span>.
                    <span v-if="currentCampaign && !currentCampaign.isBase" class="block text-primary font-medium mt-1">
                      In-game: Select "{{ currentCampaign.name }}" from the mod / launcher menu!
                    </span>
                  </p>
                </div>

                <!-- Detected files info pills -->
                <div v-if="currentDetectedCampaign?.files?.length" class="text-left p-2.5 rounded bg-black/40 border border-emerald-500/20 text-[11px] font-mono space-y-1">
                  <div class="flex items-center justify-between text-muted-foreground text-[10px]">
                    <span class="truncate">📁 {{ currentDetectedCampaign?.matchedPath }}</span>
                    <button
                      @click="showDetectedFilesList = !showDetectedFilesList"
                      class="text-emerald-400 underline hover:text-emerald-300 shrink-0 ml-2"
                    >
                      {{ showDetectedFilesList ? 'Hide Files' : 'Show Files' }}
                    </button>
                  </div>
                  <div v-if="showDetectedFilesList" class="flex flex-wrap gap-1 max-h-24 overflow-y-auto pt-1">
                    <span
                      v-for="file in (currentDetectedCampaign?.files || []).slice(0, 16)"
                      :key="file"
                      class="px-1.5 py-0.5 rounded bg-muted/60 text-foreground text-[10px] border border-border/50 truncate max-w-[120px]"
                    >
                      {{ file }}
                    </span>
                  </div>
                </div>

                <div class="pt-1 flex flex-wrap items-center justify-center gap-2">
                  <!-- Direct Launch Button via WebADB -->
                  <button
                    v-if="currentPackageConfig && questAdb.isConnected.value"
                    @click="launchAppOnQuest"
                    :disabled="isAppLaunching"
                    class="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-900/30 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <svg v-if="isAppLaunching" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    <span v-else>🚀</span>
                    <span>{{ isAppLaunching ? 'Launching...' : 'Launch on Quest' }}</span>
                  </button>

                  <button
                    v-if="nextUntransferredCampaign && !languageFolders"
                    @click="selectCampaign(nextUntransferredCampaign.id)"
                    class="px-3 py-1.5 rounded bg-primary text-primary-foreground text-[11px] font-semibold hover:bg-primary/90 transition-colors cursor-pointer flex items-center gap-1 shadow-sm"
                  >
                    <span>Next: {{ nextUntransferredCampaign.name }}</span>
                    <span>→</span>
                  </button>

                  <button
                    @click="scanCampaignFiles"
                    class="px-2.5 py-1.5 rounded bg-secondary hover:bg-secondary/80 text-secondary-foreground text-[10px] font-mono border border-border/60 transition-colors cursor-pointer flex items-center gap-1"
                    title="Re-check files on Quest"
                  >
                    <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Re-scan</span>
                  </button>

                  <button
                    @click="allowFileTransferOverride = true"
                    class="px-2.5 py-1.5 rounded bg-secondary hover:bg-secondary/80 text-secondary-foreground text-[10px] font-mono border border-border/60 transition-colors cursor-pointer"
                  >
                    Add / Replace Files
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Action Links (Footer of Action Card) -->
        <div class="pt-2 border-t border-border/80 flex flex-col gap-2">
          <a
            v-if="port.base_game_url"
            :href="port.base_game_url"
            target="_blank"
            rel="noopener noreferrer"
            class="flex min-h-11 w-full items-center justify-between rounded-lg border border-border px-3 py-2 text-xs text-foreground transition-colors hover:bg-muted/50 md:min-h-0"
          >
            <div class="flex items-center gap-2">
              <svg v-if="isLegitimateStoreUrl(port.base_game_url)" class="w-3.5 h-3.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <svg v-else class="w-3.5 h-3.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span v-if="isLegitimateStoreUrl(port.base_game_url)">Buy Base Game ({{ port.base_game_store || 'Store' }})</span>
              <span v-else>About the original game</span>
            </div>
            <span class="text-muted-foreground">↗</span>
          </a>

          <a
            v-if="pcPatchCard"
            :href="pcPatchCard.patchUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="flex min-h-11 w-full items-center justify-between rounded-lg border border-border px-3 py-2 text-xs text-foreground transition-colors hover:bg-muted/50 md:min-h-0"
            @click="trackManualDownload"
          >
            <div class="flex items-center gap-2">
              <span>{{ pcPatchCard.patchLabel }}</span>
            </div>
            <span class="text-muted-foreground">↗</span>
          </a>

          <a
            v-if="patchOnlyGuide"
            :href="patchOnlyGuide.readmeUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="flex min-h-11 w-full items-center justify-between rounded-lg bg-secondary px-3 py-2 text-xs text-secondary-foreground transition-colors hover:bg-secondary/80 md:min-h-0"
            @click="trackGithub"
          >
            <div class="flex items-center gap-2">
              <span>{{ patchOnlyGuide.readmeLabel }}</span>
            </div>
            <span class="text-muted-foreground">↗</span>
          </a>

          <a
            v-if="patchOnlyGuide?.patchUrl"
            :href="patchOnlyGuide.patchUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="flex min-h-11 w-full items-center justify-between rounded-lg border border-border px-3 py-2 text-xs text-foreground transition-colors hover:bg-muted/50 md:min-h-0"
            @click="trackManualDownload"
          >
            <div class="flex items-center gap-2">
              <span>{{ patchOnlyGuide.patchLabel }}</span>
            </div>
            <span class="text-muted-foreground">↗</span>
          </a>

          <a
            v-if="!pcPatchCard && !patchOnlyGuide && port.port_download_url && installSupport !== 'unsupported' && !inApp"
            :href="port.port_download_url"
            target="_blank"
            rel="noopener noreferrer"
            class="flex min-h-11 w-full items-center justify-between rounded-lg bg-secondary px-3 py-2 text-xs text-secondary-foreground transition-colors hover:bg-secondary/80 md:min-h-0"
            @click="trackManualDownload"
          >
            <div class="flex items-center gap-2">
              <svg class="w-3.5 h-3.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Manual APK Download ({{ port.port_download_source || 'SideQuest' }})</span>
            </div>
            <span class="text-muted-foreground">↗</span>
          </a>
        </div>

        <VerificationPanel
          :records="verificationRecords"
          :slug="port.slug"
          :latest-version="port.latest_version"
          :connected-headset="connectedVerificationHeadset"
          :install-count="port.installs ?? 0"
        />
      </div>
    </div>

    <!-- LOWER SECTION: Installation Guide & Hardware Specs Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4 border-t border-border/70">
      <!-- LEFT LOWER: Installation Guide & Troubleshooting (8 Cols) -->
      <div class="lg:col-span-8 space-y-6">
        <!-- Installation Guide (Rendered Markdown) -->
        <div id="install-guide" class="space-y-4 rounded-xl border border-border bg-card p-4 md:p-6">
          <div class="flex items-center gap-2 pb-3 border-b border-border">
            <svg class="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 class="text-lg font-bold text-foreground tracking-tight">Step-by-Step Installation Guide</h2>
          </div>

          <p class="text-xs text-muted-foreground leading-relaxed">
            <template v-if="pcPatchCard">{{ pcPatchCard.pageIntro }}</template>
            <template v-else-if="patchOnlyGuide">{{ patchOnlyGuide.pageIntro }}</template>
            <template v-else-if="inApp">The APK installs from the card above. When this port needs original game files, copy them from a PC. These steps explain that copy.</template>
            <template v-else>Install on Quest, in the card above, is the one-click USB install. These steps are the manual path (SideQuest or ADB).</template>
          </p>

          <!-- Parsed markdown content -->
          <div class="guide-content" v-html="renderedGuide"></div>
        </div>

        <!-- Troubleshooting Notes -->
        <div v-if="port.troubleshooting_notes" class="p-4 rounded-xl bg-muted/30 border border-border text-xs space-y-1.5">
          <div class="flex items-center gap-2 font-semibold text-foreground">
            <svg class="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>Troubleshooting & Tips</span>
          </div>
          <p class="leading-relaxed text-muted-foreground pl-6">
            {{ port.troubleshooting_notes }}
          </p>
        </div>
      </div>

      <!-- RIGHT LOWER: Requirements & Community Resources (4 Cols) -->
      <div class="lg:col-span-4 space-y-4">
        <!-- Requirements Summary Box -->
        <div class="p-5 rounded-xl bg-card border border-border space-y-4">
          <h3 class="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono flex items-center justify-between">
            <span>Requirements Summary</span>
            <span class="text-[10px] text-emerald-400 font-normal">Standalone VR</span>
          </h3>

          <div class="space-y-3 text-xs">
            <!-- If single campaign: show original layout -->
            <div v-if="campaignList.length <= 1" class="space-y-3">
              <!-- Base Game Source -->
              <div class="space-y-1">
                <span class="text-[11px] text-muted-foreground block font-mono">Original Game Required:</span>
                <div class="flex flex-wrap items-center gap-x-2 gap-y-1 rounded border border-border/60 bg-muted/40 p-2">
                  <span class="min-w-0 flex-1 break-words font-medium text-foreground">{{ port.base_game_store || 'PC Retail / Legal Copy' }}</span>
                  <a
                    v-if="port.base_game_url"
                    :href="port.base_game_url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex min-h-11 shrink-0 items-center whitespace-nowrap font-mono text-[10px] text-primary hover:underline md:min-h-0"
                  >
                    {{ isLegitimateStoreUrl(port.base_game_url) ? 'Store Page ↗' : 'About ↗' }}
                  </a>
                </div>
              </div>

              <!-- Target Data Folder -->
              <div class="space-y-1">
                <span class="text-[11px] text-muted-foreground block font-mono">Asset Directory on Quest:</span>
                <div class="min-w-0 truncate rounded border border-border/70 bg-black/40 p-2 font-mono text-[11px] text-primary">
                  {{ assetDirectoryText }}
                </div>
              </div>

              <div class="space-y-1">
                <span class="text-[11px] text-muted-foreground block font-mono">{{ extraFilesHeading }}</span>
                <div data-testid="extra-files" class="break-words rounded border border-border/50 bg-muted/30 p-2 font-mono text-[11px] text-foreground">
                  {{ currentCampaign?.exampleFiles }}
                </div>
              </div>
            </div>

            <!-- If multiple campaigns (Lambda1VR, SourceVR, etc.): show Campaign Matrix -->
            <div v-else class="space-y-3" data-testid="campaign-parts">
              <div class="flex items-center justify-between">
                <span class="text-[11px] text-muted-foreground font-mono">{{ languageFolders ? 'Languages:' : 'Campaigns & DLCs:' }}</span>
                <span
                  v-if="!languageFolders"
                  data-testid="campaign-part-count"
                  class="text-[10px] font-mono text-primary font-bold"
                >
                  {{ installedCampaignsCount }} / {{ campaignList.length }}
                </span>
              </div>

              <div class="space-y-1.5">
                <div
                  v-for="c in campaignList"
                  :key="c.id"
                  data-testid="campaign-part"
                  @click="selectCampaign(c.id)"
                  class="p-2 rounded border transition-colors cursor-pointer"
                  :class="currentCampaign?.id === c.id
                    ? 'bg-primary/10 border-primary/60 text-foreground'
                    : 'bg-muted/30 hover:bg-muted/50 border-border/60 text-muted-foreground'"
                >
                  <div class="mb-1 flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                    <div class="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
                      <span class="min-w-0 break-words text-xs font-bold leading-snug" :class="currentCampaign?.id === c.id ? 'text-primary' : 'text-foreground'">
                        {{ c.name }}
                      </span>
                      <span
                        v-if="partState(c) === 'ready'"
                        data-testid="campaign-part-ready"
                        class="campaign-chip bg-emerald-500/20 text-emerald-400"
                      >
                        Ready
                      </span>
                      <span
                        v-else-if="partState(c) === 'installed'"
                        data-testid="campaign-part-installed"
                        class="campaign-chip bg-emerald-500/20 text-emerald-400"
                      >
                        Installed
                      </span>
                      <span
                        v-else
                        class="campaign-chip bg-muted/80 text-muted-foreground"
                      >
                        {{ c.badge }}
                      </span>
                    </div>
                    <a
                      v-if="c.storeUrl"
                      :href="c.storeUrl"
                      target="_blank"
                      rel="noopener noreferrer"
                      @click.stop
                      class="inline-flex min-h-11 shrink-0 items-center whitespace-nowrap font-mono text-[10px] text-primary hover:underline md:min-h-0"
                      :title="isLegitimateStoreUrl(c.storeUrl) ? 'View on Store' : 'About the original game'"
                    >
                      {{ isLegitimateStoreUrl(c.storeUrl) ? c.storeName : 'About' }} ↗
                    </a>
                  </div>
                  <div
                    v-if="isCleanQuestDropPath(c.fullPath)"
                    data-testid="campaign-part-path"
                    class="break-all font-mono text-[10px] text-muted-foreground/90"
                  >
                    {{ c.folder }}/ → {{ c.fullPath }}
                  </div>
                  <div v-if="c.exampleFiles" data-testid="campaign-part-files" class="mt-0.5 break-words text-[10px] leading-snug text-muted-foreground">
                    {{ c.exampleFiles }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Community Reports & Playability Feedback -->
        <CommunityReports v-if="port" :port="port" />

        <!-- Community & Creator Support Box -->
        <div class="p-4 rounded-xl bg-card border border-border space-y-3 text-xs">
          <div class="flex items-center justify-between">
            <span class="font-semibold text-foreground flex items-center gap-1.5">
              <span>💬</span> Need Help or Mods?
            </span>
            <span class="text-[10px] font-mono text-muted-foreground">Community</span>
          </div>
          <p class="text-[11px] text-muted-foreground leading-relaxed">
            Join the developer community for installation troubleshooting, high-resolution HD mod packs, and multiplayer sessions.
          </p>
          <div class="pt-1 flex flex-col gap-1.5 font-mono text-[11px]">
            <a
              v-if="port.developer_url"
              :href="port.developer_url"
              target="_blank"
              rel="noopener noreferrer"
              class="flex min-h-11 items-center justify-between rounded border border-border/60 bg-muted/30 p-2 text-foreground transition-colors hover:bg-muted/60 md:min-h-0"
            >
              <span>Support {{ port.developer }}</span>
              <span class="text-muted-foreground">↗</span>
            </a>
            <a
              v-if="port.github_url"
              :href="port.github_url"
              target="_blank"
              rel="noopener noreferrer"
              class="flex min-h-11 items-center justify-between rounded border border-border/60 bg-muted/30 p-2 text-foreground transition-colors hover:bg-muted/60 md:min-h-0"
              @click="trackGithub"
            >
              <span>GitHub Repository & Issues</span>
              <span class="text-muted-foreground">↗</span>
            </a>
          </div>
        </div>
      </div>
    </div>

    <ClientOnly v-if="!inApp">
      <QuestAppInstallModal :install-succeeded="questAppModalAfterInstall" />
    </ClientOnly>
  </div>

  <!-- Loading State -->
  <div v-else class="max-w-md mx-auto py-24 text-center space-y-3">
    <div class="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto"></div>
    <p class="text-muted-foreground text-xs font-mono">Loading port details...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { marked } from 'marked'
import type { PortCategory, PortStatus } from '~/types/port'
import { getPortCampaigns, type PortCampaign } from '~/data/expansions'
import { campaignPartState, countInstalledParts } from '~/lib/campaignParts'
import { APP_BRIDGE_EVENT, whenAppBridgeReady } from '~/lib/appBridge'
import { apkInstalledOnHeadset } from '~/lib/apkInstalledState'
import { firstInstalledPackage } from '~/lib/headsetPackages'
import { patchOnlyGuideFor, pcPatchCardFor, refusesOneClickInstall } from '~/lib/patchOnlyInstall'
import { useQuestAdb } from '~/composables/useQuestAdb'
import {
  AUTHORIZE_PROMPT_LEAD,
  AUTHORIZE_STILL_WAITING_STEPS,
  AUTHORIZE_STILL_WAITING_TITLE,
  AUTHORIZE_WAIT_HINT_MS,
  DISMISS_CONNECTION_ERROR_LABEL,
  QUEST_PICKER_HINT,
  authorizeWaitHintVisible,
  isAuthorizeConnectionError,
  isUsbChooserDismissed,
  mockAuthorizeWaitFromSearch,
  mockUsbErrorFromSearch,
  questConnectChrome
} from '~/lib/questConnectUx'
import {
  CHOOSER_DISMISSED_STEPS,
  CHOOSER_DISMISSED_TITLE,
  CONNECT_FAILURE_STEPS,
  INSTALL_ACTION_LABEL,
  INSTALL_VIA_USB_LABEL,
  USB_PREP_STEPS,
  hasRememberedQuestConnection,
  primaryInstallBlocked,
  shouldShowUsbPrep
} from '~/lib/questInstallUx'
import {
  INSTALL_BUTTON_CLASS,
  INSTALL_BUTTON_CLASS_WITH_SEND,
  showSendToQuestDecision
} from '~/lib/remoteInstall'
import {
  USB_LOCKED_AFTER,
  USB_LOCKED_BODY,
  USB_LOCKED_COMMAND,
  USB_LOCKED_PLATFORM,
  USB_LOCKED_TITLE,
  QUEST_USB_MESSAGES
} from '~/lib/questUsbMessages'
import { mockUserAgentFromSearch, unsupportedNoticeForUserAgent } from '~/lib/unsupportedBrowser'
import { assessCampaignOnQuest, campaignPresenceIsAnyFile, isPortInstalledOnQuest, isSelfContainedSideload, PORT_PACKAGE_CONFIGS } from '~/data/portPackageMap'
import { destinationDirForDroppedFile, isCleanQuestDropPath } from '~/lib/dropPaths'
import { formatPortVersion } from '~/lib/portVersion'
import {
  apkUpdateDecision,
  assetLabelFromDownloadUrl,
  forgetInstalledRelease,
  learnInstalledRelease,
  readInstalledRelease,
  releaseIdentityMatches,
  rememberInstalledRelease,
  type InstalledReleaseRecord
} from '~/lib/installedRelease'
import { isLegitimateStoreUrl } from '~/lib/baseGameLink'
import { portShareMeta } from '~/lib/socialMeta'
import { softenGuideHtml } from '~/lib/guideHtml'
import { isMockQuestEnabled } from '~/lib/mockQuest'
import { buildInstallVerificationBody } from '~/lib/installVerification'
import { canonicalHeadset } from '~/lib/verification'
import { normalizeHeadsetList } from '~/lib/headsets'
import { missingPortError } from '~/lib/missingPort'
import { isLowSpaceError, isUserCancel, reinstallWarningCopy } from '~/lib/installFlow'
import {
  APK_PROXY_MAX_BYTES_DEFAULT,
  apkProxyCapApplies,
  exceedsApkProxyCap,
  isApkTooLargeError,
  knownApkByteSize,
  tooLargeInstallMessage
} from '~/lib/apkProxyPolicy'
import {
  apkInstallOutcome,
  claimVideoPreviewPlay,
  connectFailureReason,
  cleanInstallErrorDetail,
  createInstallStepLedger,
  installErrorReason,
  SIGNATURE_CONFLICT_MESSAGE,
  installStepEventsForConnectPhase,
  installStepEventsForConnectResult,
  installStepEventsForProgress,
  type InstallStep,
  type InstallStepStatus
} from '~/lib/analytics'
import { canHoverPreview, previewMp4Url, PREVIEW_HOVER_MS, youtubeClipForPort } from '~/data/videoPreviews'
import { versionedCoverUrl } from '~/data/coverUrl'
import { useTrack } from '~/composables/useTrack'
import { claimConnectOrigin } from '~/lib/connectOrigin'
import TransferProgress from '~/components/TransferProgress.vue'

const route = useRoute()
const router = useRouter()
const slug = route.params.slug as string
const { fetchPortBySlug } = usePorts()
const questAdb = useQuestAdb()
const questBrowser = useQuestBrowser()
const { inApp } = useAppBridge()
const connectChrome = computed(() => questConnectChrome(questAdb.connectionPhase.value, questAdb.isConnected.value))

const { data: port } = await useAsyncData(`port-${slug}`, () => fetchPortBySlug(slug))
const detailHeadsets = computed(() => normalizeHeadsetList(port.value?.supported_hardware))

if (missingPortError(port.value)) {
  throw createError({ statusCode: 404, fatal: true, statusMessage: 'Port not found' })
}

const { data: verificationData, refresh: refreshVerifications } = await useAsyncData(
  'port-verifications',
  () => fetchVerificationRecords()
)
const verificationRecords = computed(() => verificationData.value || [])

const share = computed(() => portShareMeta(port.value?.cover_image_url, port.value?.title))

useSeoMeta({
  title: () => port.value ? `${port.value.title} — QuestPorts` : 'QuestPorts',
  description: () => share.value.description,
  ogTitle: () => port.value ? `${port.value.title} (Meta Quest Standalone VR)` : 'QuestPorts',
  ogDescription: () => share.value.description,
  ogImage: () => share.value.image,
  ogImageSecureUrl: () => share.value.image,
  ogImageType: () => share.value.type,
  ogImageWidth: () => share.value.width,
  ogImageHeight: () => share.value.height,
  ogImageAlt: () => share.value.alt,
  ogType: 'article',
  twitterCard: 'summary_large_image',
  twitterTitle: () => port.value ? `${port.value.title} (Meta Quest Standalone VR)` : 'QuestPorts',
  twitterDescription: () => share.value.description,
  twitterImage: () => share.value.image,
  twitterImageAlt: () => share.value.alt,
})

// Quest connection state (tied to global questAdb singleton so Navbar & Card are 100% in sync)
const isQuestConnected = computed(() => questAdb.isConnected.value)
const questDeviceModel = computed(() => questAdb.deviceModel.value || 'Meta Quest Connected')
const connectedVerificationHeadset = computed(() => {
  if (!questAdb.isConnected.value) return null
  return canonicalHeadset(questAdb.deviceModel.value)
})
const questDeviceInfoText = computed(() => {
  const parts: string[] = []
  if (questAdb.batteryLevel.value !== null) {
    parts.push(`⚡ ${questAdb.batteryLevel.value}%`)
  }
  if (questAdb.storageFree.value) {
    parts.push(`${questAdb.storageFree.value} free`)
  }
  return parts.join(' • ')
})

const showUsbPrep = ref(false)
const questAppModalAfterInstall = ref(false)
const usbPrepRemembered = ref(false)
const installSupportReady = ref(false)
const manualInstallOpen = ref(false)
const usbPrepContinueRef = ref<HTMLButtonElement | null>(null)

const previewUserAgent = computed(() => mockUserAgentFromSearch(route.fullPath))
const mockUsbError = computed(() => mockUsbErrorFromSearch(route.fullPath))

const installSupport = computed<'unknown' | 'supported' | 'unsupported'>(() => {
  if (previewUserAgent.value) return 'unsupported'
  if (!installSupportReady.value) return 'unknown'
  return questAdb.isWebUsbSupported.value ? 'supported' : 'unsupported'
})

const showChooserHelp = computed(() =>
  !questBrowser.value && (Boolean(questAdb.connectNotice.value) || mockUsbError.value === 'cancelled')
)

const showUsbLocked = computed(() => {
  if (questBrowser.value || showChooserHelp.value) return false
  if (mockUsbError.value === 'locked') return true
  return installSupport.value === 'supported'
    && questAdb.connectionError.value === QUEST_USB_MESSAGES.usbLocked
})

const showOtherConnectionError = computed(() =>
  !questBrowser.value
  && !showChooserHelp.value
  && !showUsbLocked.value
  && installSupport.value === 'supported'
  && Boolean(questAdb.connectionError.value)
)

const authorizeConnectionError = computed(() => isAuthorizeConnectionError(questAdb.connectionError.value))

const connectionFailureSteps = computed(() =>
  authorizeConnectionError.value ? AUTHORIZE_STILL_WAITING_STEPS : CONNECT_FAILURE_STEPS
)

const showAuthorizeWaitHint = ref(false)
let authorizeHintTimer: ReturnType<typeof setTimeout> | undefined

const clearAuthorizeHintTimer = () => {
  if (authorizeHintTimer) {
    clearTimeout(authorizeHintTimer)
    authorizeHintTimer = undefined
  }
}

watch(() => connectChrome.value.showHeadsetBanner, (showing) => {
  clearAuthorizeHintTimer()
  if (!showing) {
    showAuthorizeWaitHint.value = false
    return
  }
  if (mockAuthorizeWaitFromSearch(route.fullPath)) {
    showAuthorizeWaitHint.value = true
    return
  }
  showAuthorizeWaitHint.value = false
  if (!import.meta.client) return
  authorizeHintTimer = setTimeout(() => {
    showAuthorizeWaitHint.value = authorizeWaitHintVisible(AUTHORIZE_WAIT_HINT_MS)
  }, AUTHORIZE_WAIT_HINT_MS)
}, { immediate: true })

onUnmounted(clearAuthorizeHintTimer)

const headsetStatusLabel = computed(() => {
  if (isQuestConnected.value) return questDeviceModel.value || 'Meta Quest connected'
  if (connectChrome.value.showHeadsetBanner) return 'Authorizing Quest...'
  if (connectChrome.value.showPickerHint) return 'Select your Quest...'
  return 'No Quest connected'
})

const installFlowChrome = computed(() => {
  return showUsbPrep.value
    || connectChrome.value.showPickerHint
    || connectChrome.value.showHeadsetBanner
    || showChooserHelp.value
    || showUsbLocked.value
    || Boolean(questAdb.connectionError.value)
})

const requestUsbPrepAgain = () => {
  questAdb.dismissConnectNotice()
  showUsbPrep.value = true
}

const dismissUsbPrep = () => {
  showUsbPrep.value = false
}

watch(showUsbPrep, async (open) => {
  if (!open) return
  await nextTick()
  usbPrepContinueRef.value?.focus()
  if (import.meta.client && window.matchMedia('(max-width: 767px)').matches) {
    document.querySelector('[data-testid="usb-prep"]')?.scrollIntoView({ block: 'center' })
  }
})

watch(installSupport, (support) => {
  if (support !== 'unsupported') return
  const userAgent = previewUserAgent.value || (import.meta.client ? navigator.userAgent : '')
  if (!unsupportedNoticeForUserAgent(userAgent).copyLink) manualInstallOpen.value = true
})

watch(() => questAdb.isConnected.value, (connected) => {
  if (!connected) return
  usbPrepRemembered.value = true
  showUsbPrep.value = false
})

// Installation and Campaigns State
const isDetectedOnConnectedQuest = computed(() => {
  if (!questAdb.isConnected.value || !slug) return false
  return isPortInstalledOnQuest(slug, questAdb.installedPackages.value)
})

/** App bridge saw the package (primary or alt). WebUSB uses the package list. */
const bridgePackageInstalled = ref(false)

const isApkInstalled = computed(() => apkInstalledOnHeadset({
  connected: questAdb.isConnected.value,
  slug,
  installedPackages: questAdb.installedPackages.value,
  bridgeInstalled: bridgePackageInstalled.value
}))
const isInstallingApk = ref(false)
const apkProgress = ref(0)
const apkInstallError = ref<string | null>(null)
const spaceNotice = ref<string | null>(null)
const spaceNoticeKind = ref<'block' | 'warn'>('warn')
const showReinstallPrompt = ref(false)
const reinstallError = ref<string | null>(null)

onMounted(() => {
  installSupportReady.value = true
  usbPrepRemembered.value = hasRememberedQuestConnection(window.localStorage)
})

watch(() => questAdb.installProgress.value, (progress) => {
  if (!isInstallingApk.value) return
  apkProgress.value = progress.percent
}, { deep: true })

const canCancelInstall = computed(() => {
  const step = questAdb.installProgress.value.step
  return isInstallingApk.value && (step === 'downloading' || step === 'pushing')
})

const installLockedNote = computed(() => {
  if (questAdb.installProgress.value.step !== 'installing') return ''
  return 'Installing on the headset. This step runs to completion so the package is not left half-installed.'
})

const reinstallCopy = computed(() => reinstallWarningCopy(port.value?.slug))

const showsNoExtraFiles = computed(() => {
  return isDirectApkOnly.value || currentCampaign.value?.exampleFiles === 'No extra files needed'
})

const extraFilesHeading = computed(() => {
  if (showsNoExtraFiles.value) return 'Extra files:'
  if (campaignList.value.length > 1 && currentCampaign.value?.name) {
    return `Required for ${currentCampaign.value.name}:`
  }
  return 'Required Files:'
})

const selectedCampaignId = ref<string | null>(null)
const transferredCampaigns = ref<Record<string, boolean>>({})
const isScanningGameFiles = ref(false)
const detectedCampaigns = ref<Record<string, { exists: boolean; matchedPath: string; fileCount: number; files: string[]; confirmReason: 'unreadable' | 'unproven' | null }>>({})
const confirmedCampaigns = ref<Record<string, boolean>>({})
const allowFileTransferOverride = ref(false)
const showDetectedFilesList = ref(false)

const isTransferringFiles = ref(false)
const fileTransferProgress = ref(0)
const fileTransferIndeterminate = ref(false)
const fileTransferReceived = ref('')
const fileTransferStatusMsg = ref('')
const fileTransferCancelRequested = ref(false)
const copiedCampaignId = ref<string | null>(null)
let copiedCampaignTimer: ReturnType<typeof setTimeout> | undefined
const fileInputRef = ref<HTMLInputElement | null>(null)

const campaignList = computed<PortCampaign[]>(() => {
  if (!port.value) return []
  return getPortCampaigns(port.value)
})

const currentCampaign = computed<PortCampaign | null>(() => {
  const list = campaignList.value
  if (!list.length) return null
  if (selectedCampaignId.value) {
    const found = list.find(c => c.id === selectedCampaignId.value)
    if (found) return found
  }
  return list[0] ?? null
})

const languageFolders = computed(() => {
  const list = campaignList.value
  return list.length > 1 && list.every(campaign => campaign.badge === 'Language')
})

const currentDropPathClean = computed(() => isCleanQuestDropPath(currentCampaign.value?.fullPath))

const assetDirectoryText = computed(() => {
  const path = currentCampaign.value?.fullPath || ''
  if (isCleanQuestDropPath(path)) return path
  if (currentCampaign.value?.exampleFiles === 'No extra files needed') return path || 'N/A'
  return 'See the installation guide'
})

const currentDetectedCampaign = computed(() => {
  const id = currentCampaign.value?.id
  return id ? detectedCampaigns.value[id] : undefined
})

const selectCampaign = (campaignId: string) => {
  selectedCampaignId.value = campaignId
  isTransferringFiles.value = false
  fileTransferProgress.value = 0
  allowFileTransferOverride.value = false
  showDetectedFilesList.value = false
}

// Automatically scan Quest storage for all campaigns of this port
const scanCampaignFiles = async () => {
  if (!questAdb.isConnected.value || !port.value) return
  isScanningGameFiles.value = true

  try {
    const slugName = port.value.slug
    for (const campaign of campaignList.value) {
      if (!isCleanQuestDropPath(campaign.fullPath)) continue
      const res = campaignPresenceIsAnyFile(slugName)
        ? await questAdb.checkCampaignFilesOnQuest(campaign)
        : await assessCampaignOnQuest(slugName, campaign, path => questAdb.listRemoteDir(path))
      detectedCampaigns.value[campaign.id] = {
        exists: res.exists,
        matchedPath: res.matchedPath,
        fileCount: 'fileCount' in res ? res.fileCount : res.files.length,
        files: res.files,
        confirmReason: 'confirmReason' in res ? res.confirmReason : null
      }
      if (res.exists) {
        const targetKey = `${port.value.id}-${campaign.id}`
        transferredCampaigns.value[targetKey] = true
      }
    }
  } catch (err) {
    console.warn('[QuestPorts] Failed scanning campaign files on Quest:', err)
  } finally {
    isScanningGameFiles.value = false
  }
}

// Trigger storage scan when Quest connects or port changes
watch(
  [() => questAdb.isConnected.value, () => port.value?.id],
  ([connected, portId]) => {
    confirmedCampaigns.value = {}
    if (connected && portId) {
      scanCampaignFiles()
    }
  },
  { immediate: true }
)

const confirmImportedFiles = () => {
  const id = currentCampaign.value?.id
  if (!id) return
  confirmedCampaigns.value = { ...confirmedCampaigns.value, [id]: true }
}

const confirmCopy = computed(() => {
  const reason = currentDetectedCampaign.value?.confirmReason
  if (reason === 'unproven') {
    return 'QuestPorts cannot see this port’s imported files over USB. If you already ran its installer or in-app import, confirm to show Launch.'
  }
  if (reason === 'unreadable') {
    return 'USB cannot list this Android/data folder (Quest keeps it private). If you already imported the files, confirm to show Launch. A stray file somewhere else is not enough.'
  }
  return ''
})

const isCurrentCampaignTransferred = computed(() => {
  if (isDirectApkOnly.value && isApkInstalled.value) return true
  const currentPort = port.value
  const activeCampaign = currentCampaign.value
  if (!currentPort || !activeCampaign) return false
  if (allowFileTransferOverride.value) return false
  const detected = detectedCampaigns.value[activeCampaign.id]
  if (detected?.exists) return true
  if (detected?.confirmReason && confirmedCampaigns.value[activeCampaign.id]) return true
  // When the headset is connected, only files actually found on disk count as ready.
  if (questAdb.isConnected.value) return false
  const targetKey = `${currentPort.id}-${activeCampaign.id}`
  return !!transferredCampaigns.value[targetKey]
})

const readBridgePackage = () => {
  if (!import.meta.client || !slug) {
    bridgePackageInstalled.value = false
    return
  }
  const bridge = window.QuestPortsApp
  if (!bridge || typeof bridge.isInstalled !== 'function') {
    bridgePackageInstalled.value = false
    return
  }
  const found = firstInstalledPackage(
    slug,
    name => bridge.isInstalled(name),
    PORT_PACKAGE_CONFIGS[slug]?.packageName
  )
  if (!found) {
    bridgePackageInstalled.value = false
    return
  }
  try {
    bridge.getInstalledVersion(found)
  } catch {
    // The id is enough. A version read can throw for a package the bridge just reported.
  }
  bridgePackageInstalled.value = true
}

let stopBridgeWait = () => {}
let listeningForBridge = false

onMounted(() => {
  // Desktop WebUSB fills installedPackages on its own. The app bridge arrives
  // after hydration, the same way the Library tab waits for it.
  if (!inApp.value && !window.QuestPortsApp) return
  listeningForBridge = true
  stopBridgeWait = whenAppBridgeReady(readBridgePackage)
  window.addEventListener(APP_BRIDGE_EVENT, readBridgePackage)
})

onUnmounted(() => {
  stopBridgeWait()
  if (!listeningForBridge) return
  window.removeEventListener(APP_BRIDGE_EVENT, readBridgePackage)
})

watch(() => port.value?.slug, () => readBridgePackage())

const packageInstalled = isApkInstalled

const partFilesReady = (campaign: { id: string }) => {
  // A folder found earlier in this visit is not still "on the Quest" once USB is gone.
  if (!questAdb.isConnected.value) return false
  const currentPort = port.value
  if (!currentPort) return false
  const targetKey = `${currentPort.id}-${campaign.id}`
  return !!transferredCampaigns.value[targetKey] || !!detectedCampaigns.value[campaign.id]?.exists
}

const partState = (campaign: PortCampaign) => campaignPartState(campaign, {
  packageInstalled: packageInstalled.value,
  filesReady: partFilesReady(campaign)
})

const installedCampaignsCount = computed(() => countInstalledParts(campaignList.value, part => ({
  packageInstalled: packageInstalled.value,
  filesReady: partFilesReady(part)
})))

const nextUntransferredCampaign = computed(() => {
  const currentPort = port.value
  if (!currentPort || campaignList.value.length <= 1) return null
  return campaignList.value.find(c => {
    const targetKey = `${currentPort.id}-${c.id}`
    return !transferredCampaigns.value[targetKey] && !detectedCampaigns.value[c.id]?.exists
  }) || null
})

// Current port package config (for launching app on Quest)
const currentPackageConfig = computed(() => {
  if (!port.value?.slug) return null
  return PORT_PACKAGE_CONFIGS[port.value.slug] || null
})

const isPcBuilderRequired = computed(() => {
  return currentPackageConfig.value?.installType === 'pc_builder_required'
})

const patchOnlyGuide = computed(() => {
  const current = port.value
  if (!current) return null
  return patchOnlyGuideFor(current.slug, current.port_download_url, current.github_url)
})

const pcPatchCard = computed(() => pcPatchCardFor(port.value?.slug))

const publicConfig = useRuntimeConfig().public
const apkProxyCap = computed(() => {
  const configured = Number(publicConfig.apkProxyMaxBytes)
  return Number.isFinite(configured) && configured > 0 ? configured : APK_PROXY_MAX_BYTES_DEFAULT
})
const enforceApkSizeCap = computed(() => apkProxyCapApplies(publicConfig.apkProxyBase))
const catalogApkBytes = computed(() => knownApkByteSize(port.value?.download_bytes))
const largePortNotice = ref<string | null>(null)
const largePortMessage = computed(() => {
  if (largePortNotice.value) return largePortNotice.value
  if (!enforceApkSizeCap.value) return null
  const bytes = catalogApkBytes.value
  if (bytes != null && exceedsApkProxyCap(bytes, apkProxyCap.value)) return tooLargeInstallMessage(bytes)
  return null
})

const showPrimaryInstall = computed(() => !primaryInstallBlocked({
  showPrep: showUsbPrep.value,
  picker: connectChrome.value.showPickerHint,
  authorizing: connectChrome.value.showHeadsetBanner,
  dismissed: showChooserHelp.value,
  connectionError: showUsbLocked.value || showOtherConnectionError.value,
  installing: isInstallingApk.value,
  supported: installSupport.value === 'supported',
  tooLarge: Boolean(largePortMessage.value)
}))

const showSendToQuest = computed(() => showSendToQuestDecision({
  ready: installSupportReady.value,
  questBrowser: questBrowser.value,
  inApp: inApp.value,
  eligible: !refusesOneClickInstall(port.value?.slug, port.value?.port_download_url),
  flag: publicConfig.remoteInstall,
  search: import.meta.client ? window.location.search : ''
}))

const showUsbStepsLink = computed(() => {
  return !questBrowser.value
    && usbPrepRemembered.value
    && installSupport.value === 'supported'
    && !isPcBuilderRequired.value
    && !pcPatchCard.value
    && !patchOnlyGuide.value
    && !isQuestConnected.value
    && !showUsbPrep.value
    && !connectChrome.value.showPickerHint
    && !connectChrome.value.showHeadsetBanner
    && !showChooserHelp.value
    && !showUsbLocked.value
    && !showOtherConnectionError.value
})

const isDirectApkOnly = computed(() => isSelfContainedSideload(currentPackageConfig.value))

const manualCopyCampaigns = computed(() => {
  if (isDirectApkOnly.value) return []
  return campaignList.value.filter(campaign => {
    if (!isCleanQuestDropPath(campaign.fullPath)) return false
    return campaign.exampleFiles !== 'No extra files needed'
  })
})

const showAppGameDataGuide = computed(() => {
  if (isDirectApkOnly.value || isPcBuilderRequired.value || patchOnlyGuide.value || pcPatchCard.value) return false
  if (manualCopyCampaigns.value.length) return false
  return campaignList.value.some(campaign => campaign.exampleFiles !== 'No extra files needed')
})

const step2Title = computed(() => {
  if (currentPackageConfig.value?.workflowType === 'emulator_roms') {
    return 'Step 2: ROMs & ISOs Library'
  }
  if (currentPackageConfig.value?.workflowType === 'obb_extractor') {
    return 'Step 2: Audio & Mod Assets'
  }
  if (currentPackageConfig.value?.workflowType === 'smart_converter') {
    return 'Step 2: Converted Console Assets'
  }
  return 'Step 2: Game Data Files'
})

const isAppLaunching = ref(false)
const launchAppOnQuest = async () => {
  const pkg = currentPackageConfig.value?.packageName
  if (!pkg || !questAdb.isConnected.value) return
  isAppLaunching.value = true
  try {
    await questAdb.launchApp(pkg)
  } finally {
    setTimeout(() => {
      isAppLaunching.value = false
    }, 1500)
  }
}

// Uninstall App from Quest logic
const showUninstallPrompt = ref(false)
const isUninstallingApp = ref(false)
const uninstallErrorMsg = ref<string | null>(null)

const getInstalledPackageName = (): string | null => {
  if (!port.value?.slug) return null
  const cfg = PORT_PACKAGE_CONFIGS[port.value.slug]
  const installed = questAdb.installedPackages.value
  const findInstalled = (name: string) => installed.find(p => p.trim().toLowerCase() === name.toLowerCase())
  if (cfg?.packageName) {
    const found = findInstalled(cfg.packageName)
    if (found) return found.trim()
  }
  if (cfg?.altPackages) {
    for (const alt of cfg.altPackages) {
      const found = findInstalled(alt)
      if (found) return found.trim()
    }
  }
  const cleanSlug = port.value.slug.toLowerCase().replace(/[^a-z0-9]/g, '')
  if (cleanSlug.length >= 3) {
    const matched = installed.find(pkg => {
      const cleanPkg = pkg.toLowerCase().replace(/[^a-z0-9]/g, '')
      return cleanPkg.includes(cleanSlug) || cleanSlug.includes(cleanPkg)
    })
    if (matched) return matched
  }
  return cfg?.packageName || null
}

const headsetApkVersion = ref<string | null>(null)
const headsetApkVersionCode = ref<string | null>(null)
const installedRelease = ref<InstalledReleaseRecord | null>(null)
const catalogVersion = computed(() => formatPortVersion(port.value?.latest_version))
const apkUpdate = computed(() => apkUpdateDecision({
  installedVersionName: headsetApkVersion.value,
  installedVersionCode: headsetApkVersionCode.value,
  catalogVersion: port.value?.latest_version,
  record: installedRelease.value
}))
const isApkOutdated = computed(() => apkUpdate.value.outdated)
const installedStatusDetail = computed(() => {
  const catalog = catalogVersion.value
  if (apkUpdate.value.outdated && apkUpdate.value.reason === 'release') {
    return `Installed ${formatPortVersion(installedRelease.value?.releaseTag)} → catalog ${catalog}`
  }
  if (apkUpdate.value.outdated) {
    const headset = formatPortVersion(headsetApkVersion.value) || headsetApkVersion.value || ''
    return `Headset ${headset} → catalog ${catalog}`
  }
  const record = installedRelease.value
  const recorded = record && releaseIdentityMatches(record, headsetApkVersion.value, headsetApkVersionCode.value)
    ? record.releaseTag
    : ''
  if (recorded && headsetApkVersion.value && formatPortVersion(headsetApkVersion.value) !== catalog) {
    return `Installed ${recorded}`
  }
  if (headsetApkVersion.value) return `Installed ${headsetApkVersion.value}`
  return isDirectApkOnly.value
    ? 'Standalone port ready to launch'
    : 'Ready to launch or manage game data files'
})

const syncInstalledRelease = (pkg: string) => {
  if (!import.meta.client) {
    installedRelease.value = null
    return
  }
  let record = readInstalledRelease(window.localStorage, questAdb.deviceSerial.value, pkg)
  const learned = learnInstalledRelease(record, headsetApkVersion.value, headsetApkVersionCode.value)
  if (learned && record && learned !== record) {
    rememberInstalledRelease(window.localStorage, learned)
    record = learned
  }
  installedRelease.value = record
}

const forgetHeadsetRelease = (pkg: string | null) => {
  if (!pkg) {
    installedRelease.value = null
    return
  }
  if (import.meta.client) {
    forgetInstalledRelease(window.localStorage, questAdb.deviceSerial.value, pkg)
  }
  installedRelease.value = null
}

const rememberCatalogInstall = () => {
  if (!import.meta.client || !port.value) return
  const pkg = getInstalledPackageName()
  const releaseTag = formatPortVersion(port.value.latest_version)
  if (!pkg || !releaseTag) return
  const asset = questAdb.lastInstallAsset.value
    || assetLabelFromDownloadUrl(port.value.port_download_url)
    || ''
  installedRelease.value = rememberInstalledRelease(window.localStorage, {
    serial: questAdb.deviceSerial.value,
    packageName: pkg,
    releaseTag,
    asset,
    versionName: headsetApkVersion.value,
    versionCode: headsetApkVersionCode.value
  })
}

const refreshHeadsetApkVersion = async () => {
  headsetApkVersion.value = null
  headsetApkVersionCode.value = null
  if (!questAdb.isConnected.value || !isDetectedOnConnectedQuest.value) {
    installedRelease.value = null
    return
  }
  const pkg = getInstalledPackageName()
  if (!pkg) {
    installedRelease.value = null
    return
  }
  const info = await questAdb.getPackageVersion(pkg)
  headsetApkVersion.value = info.versionName
  headsetApkVersionCode.value = info.versionCode
  syncInstalledRelease(pkg)
}

watch(
  [() => questAdb.isConnected.value, isDetectedOnConnectedQuest, () => port.value?.slug],
  () => {
    refreshHeadsetApkVersion()
  },
  { immediate: true }
)

const executeUninstallApp = async () => {
  uninstallErrorMsg.value = null
  const pkg = getInstalledPackageName()

  if (questAdb.isConnected.value && pkg) {
    isUninstallingApp.value = true
    try {
      const ok = await questAdb.uninstallPackage(pkg)
      if (ok) {
        forgetHeadsetRelease(pkg)
        showUninstallPrompt.value = false
        if (port.value) {
          for (const c of campaignList.value) {
            delete transferredCampaigns.value[`${port.value.id}-${c.id}`]
          }
        }
      } else {
        uninstallErrorMsg.value = `Headset could not remove package "${pkg}". You can also uninstall it from Quest Library (Unknown Sources).`
      }
    } catch (err: any) {
      console.error('Uninstall error:', err)
      uninstallErrorMsg.value = err?.message || 'Error executing uninstall command on headset.'
    } finally {
      isUninstallingApp.value = false
    }
  } else {
    // Nothing to remove over USB. Close the prompt; the card follows the package list.
    forgetHeadsetRelease(pkg)
    showUninstallPrompt.value = false
    if (port.value) {
      for (const c of campaignList.value) {
        delete transferredCampaigns.value[`${port.value.id}-${c.id}`]
      }
    }
  }
}

const { track } = useTrack()

const trackContext = () => ({
  path: route.path,
  portSlug: port.value?.slug || null,
  headset: questAdb.deviceModel.value || null
})

const trackGithub = () => {
  track('github_click', trackContext())
}

const trackManualDownload = () => {
  track('manual_download_click', trackContext())
}

const trackPcBuilderLink = () => {
  const url = port.value?.port_download_url || port.value?.github_url || ''
  if (/github\.com/i.test(url)) trackGithub()
}

const trackInstall = (
  event: 'install_click' | 'install_success' | 'install_error',
  reason?: string,
  detail?: string
) => {
  const cleaned = event === 'install_error' ? cleanInstallErrorDetail(detail) : null
  track(event, {
    ...trackContext(),
    props: event === 'install_error'
      ? { reason: reason || 'other', ...(cleaned ? { detail: cleaned } : {}) }
      : null
  })
}

const detailPreviewPlaying = ref(false)
const detailPreviewVideo = ref<HTMLVideoElement | null>(null)
const youtubeActive = ref(false)
let detailPreviewTimer: ReturnType<typeof setTimeout> | null = null
const mediaBase = computed(() => String(useRuntimeConfig().public.mediaBase || ''))
const youtubeClip = computed(() => youtubeClipForPort({
  slug: port.value?.slug,
  youtubeId: port.value?.youtube_video_id,
  start: port.value?.video_preview_start,
  end: port.value?.video_preview_end
}))
const detailPreviewSource = computed(() => {
  if (youtubeClip.value) return null
  return previewMp4Url({
    slug: port.value?.slug,
    videoPreviewUrl: port.value?.video_preview_url,
    mediaBase: mediaBase.value
  })
})
const coverSrc = computed(() => versionedCoverUrl(port.value?.cover_image_url, mediaBase.value)
  || 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?auto=format&fit=crop&w=1200&q=80')

const stopDetailPreview = () => {
  if (detailPreviewTimer) {
    clearTimeout(detailPreviewTimer)
    detailPreviewTimer = null
  }
  detailPreviewPlaying.value = false
}

const armDetailPreview = () => {
  if (!detailPreviewSource.value || !canHoverPreview()) return
  if (detailPreviewTimer) clearTimeout(detailPreviewTimer)
  detailPreviewTimer = setTimeout(() => {
    detailPreviewPlaying.value = true
  }, PREVIEW_HOVER_MS)
}

watch(detailPreviewPlaying, async (playing) => {
  if (!playing) return
  await nextTick()
  try {
    await detailPreviewVideo.value?.play()
  } catch {
    detailPreviewPlaying.value = false
  }
})

watch(() => port.value?.slug, () => {
  youtubeActive.value = false
  stopDetailPreview()
})

onUnmounted(() => {
  if (detailPreviewTimer) clearTimeout(detailPreviewTimer)
})

const trackDetailPreview = () => {
  if (!import.meta.client || !port.value) return
  if (!claimVideoPreviewPlay(window.sessionStorage, port.value.slug)) return
  track('video_preview_play', {
    ...trackContext(),
    props: { surface: 'detail' }
  })
}

const onDetailPreviewPlaying = () => {
  trackDetailPreview()
}

const playYoutube = () => {
  if (!youtubeClip.value || !port.value) return
  detailPreviewPlaying.value = false
  youtubeActive.value = true
  trackDetailPreview()
}

const trackInstallStep = (
  ledger: ReturnType<typeof createInstallStepLedger>,
  step: InstallStep,
  status: InstallStepStatus
) => {
  const accepted = status === 'start' ? ledger.start(step) : ledger.finish(step, status)
  if (!accepted) return
  track('install_step', {
    ...trackContext(),
    props: { step, status }
  })
}

const applyInstallSteps = (
  ledger: ReturnType<typeof createInstallStepLedger>,
  events: Array<{ step: InstallStep; status: InstallStepStatus }>
) => {
  for (const event of events) trackInstallStep(ledger, event.step, event.status)
}

const recordInstallVerification = async () => {
  if (!port.value) return
  await trackInstall('install_success')
  const selfContained = isDirectApkOnly.value
  const campaigns = campaignList.value
  const gameFilesDetected = selfContained
    ? null
    : campaigns.length > 0 && campaigns.every(campaign => detectedCampaigns.value[campaign.id]?.exists)
  const storagePathConfirmed = selfContained
    ? null
    : Boolean(gameFilesDetected) && campaigns.every(campaign => {
      const detected = detectedCampaigns.value[campaign.id]
      return Boolean(detected?.exists && detected.matchedPath)
    })
  const body = buildInstallVerificationBody({
    mockEnabled: isMockQuestEnabled(),
    deviceSerial: questAdb.deviceSerial.value,
    deviceModel: questAdb.deviceModel.value,
    slug: port.value.slug,
    testedVersion: port.value.latest_version || headsetApkVersion.value || '',
    apkInstalled: true,
    gameFilesDetected,
    storagePathConfirmed
  })
  if (!body) return
  try {
    await $fetch('/api/verifications', { method: 'POST', body })
    await refreshVerifications()
  } catch (err) {
    console.warn('[QuestPorts] Install verification was not recorded:', err)
  }
}

// 1-Click APK Install Handler
const noteInstallFailure = (err: any) => {
  if (isApkTooLargeError(err)) {
    largePortNotice.value = err.message || tooLargeInstallMessage(err.size)
    apkInstallError.value = null
    trackInstall('install_error', 'too_large', err?.message)
    return
  }
  if (isUserCancel(err) || isUsbChooserDismissed(err)) {
    apkInstallError.value = null
    trackInstall('install_error', 'user_cancelled', err?.message)
    return
  }
  const message = err?.message || 'Failed to install APK on headset.'
  if (isLowSpaceError(err) || message.startsWith('Not enough free space')) {
    spaceNotice.value = message
    spaceNoticeKind.value = 'block'
    apkInstallError.value = null
    trackInstall('install_error', 'storage', message)
    return
  }
  console.error('Failed to install APK via WebADB:', err)
  const reason = installErrorReason(err)
  apkInstallError.value = reason === 'signature_conflict' ? SIGNATURE_CONFLICT_MESSAGE : message
  trackInstall('install_error', reason, message)
}

const retryUsbConnect = async () => {
  if (mockUsbError.value) {
    const query = { ...route.query }
    delete query.mockUsbError
    await router.replace({ path: route.path, query })
  }
  await beginInstall({ skipPrep: true })
}

const retryFromAuthorize = async () => {
  await questAdb.cancelConnect()
  await retryUsbConnect()
}

const beginInstall = async (options?: { skipPrep?: boolean }) => {
  if (inApp.value) return
  if (questBrowser.value) return
  if (isInstallingApk.value || !port.value) return
  if (refusesOneClickInstall(port.value.slug, port.value.port_download_url)) return
  if (installSupport.value !== 'supported') return
  const skipPrep = Boolean(options?.skipPrep) || questAdb.isConnected.value
  if (!skipPrep && shouldShowUsbPrep(usbPrepRemembered.value, false)) {
    showUsbPrep.value = true
    return
  }
  showUsbPrep.value = false
  await handleApkInstall()
}

const cancelApkInstall = async () => {
  await questAdb.cancelInstall()
  apkInstallError.value = null
  spaceNotice.value = null
  isInstallingApk.value = false
  apkProgress.value = 0
}

const openReinstallPrompt = () => {
  reinstallError.value = null
  showUninstallPrompt.value = false
  showReinstallPrompt.value = true
}

const installKeepingData = async () => {
  showReinstallPrompt.value = false
  await beginInstall()
}

const executeReinstall = async () => {
  reinstallError.value = null
  const pkg = getInstalledPackageName()
  if (!questAdb.isConnected.value || !pkg) {
    reinstallError.value = 'Connect the Quest so the installed package can be removed before it is installed again.'
    return
  }
  isUninstallingApp.value = true
  try {
    const ok = await questAdb.uninstallPackage(pkg)
    if (!ok) {
      reinstallError.value = `Headset could not remove package "${pkg}". App data was left in place, and the APK was not installed again.`
      return
    }
    showReinstallPrompt.value = false
    await handleApkInstall()
  } catch (err: any) {
    reinstallError.value = err?.message || 'Error executing uninstall command on headset.'
  } finally {
    isUninstallingApp.value = false
  }
}

const handleApkInstall = async () => {
  if (inApp.value) return
  if (questBrowser.value || isInstallingApk.value || !port.value) return
  if (refusesOneClickInstall(port.value.slug, port.value.port_download_url)) return
  apkInstallError.value = null
  spaceNotice.value = null
  spaceNoticeKind.value = 'warn'
  trackInstall('install_click')

  const knownBytes = knownApkByteSize(port.value.download_bytes)
  if (enforceApkSizeCap.value && knownBytes != null && exceedsApkProxyCap(knownBytes, apkProxyCap.value)) {
    largePortNotice.value = tooLargeInstallMessage(knownBytes)
    trackInstall('install_error', 'too_large')
    return
  }

  const downloadUrl = port.value.port_download_url
  if (!downloadUrl) {
    apkInstallError.value = 'No APK download URL configured for this port.'
    trackInstall('install_error', 'other')
    return
  }

  const steps = createInstallStepLedger()

  // The headset must be connected via ADB. A cancelled USB chooser already has its own notice.
  if (!questAdb.isConnected.value) {
    if (!questAdb.isWebUsbSupported.value) {
      trackInstall('install_error', 'no_webusb')
      return
    }
    claimConnectOrigin('install')
    trackInstallStep(steps, 'connect', 'start')
    let sawAuthorize = false
    const stopConnect = watch(questAdb.connectionPhase, (phase) => {
      const phaseEvents = installStepEventsForConnectPhase(phase)
      if (phaseEvents.some(event => event.step === 'authorize')) sawAuthorize = true
      applyInstallSteps(steps, phaseEvents)
    }, { flush: 'sync' })
    try {
      await questAdb.connect()
    } finally {
      stopConnect()
    }
    applyInstallSteps(steps, installStepEventsForConnectResult({
      connected: questAdb.isConnected.value,
      sawAuthorize
    }))
    if (!questAdb.isConnected.value) {
      trackInstall('install_error', connectFailureReason({
        webusb: questAdb.isWebUsbSupported.value,
        notice: questAdb.connectNotice.value,
        error: questAdb.connectionError.value
      }))
      return
    }
  }

  isInstallingApk.value = true
  apkProgress.value = 0
  let previousInstallStep = questAdb.installProgress.value.step
  const stopProgress = watch(() => questAdb.installProgress.value.step, (step) => {
    applyInstallSteps(steps, installStepEventsForProgress(previousInstallStep, step))
    previousInstallStep = step
  }, { flush: 'sync' })
  try {
    const installed = await questAdb.installApkUrl(downloadUrl, port.value.title)
    if (questAdb.installSpaceWarning.value) {
      spaceNotice.value = questAdb.installSpaceWarning.value
      spaceNoticeKind.value = 'warn'
    }
    if (apkInstallOutcome({
      installed: Boolean(installed),
      progressStep: questAdb.installProgress.value.step
    }) === 'success') {
      await questAdb.updatePackages()
      await refreshHeadsetApkVersion()
      rememberCatalogInstall()
      await scanCampaignFiles()
      await recordInstallVerification()
      if (questAdb.isConnected.value) questAppModalAfterInstall.value = true
    } else {
      trackInstall('install_error', 'user_cancelled')
    }
  } catch (err: any) {
    noteInstallFailure(err)
  } finally {
    stopProgress()
    isInstallingApk.value = false
  }
}

// File drop & real push handling
const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const handleFileInputChange = async (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    await uploadRealFiles(Array.from(target.files))
  }
}

const traverseDroppedEntry = async (item: any, path = ''): Promise<{ file: File, relPath: string }[]> => {
  if (item.isFile) {
    return new Promise((resolve) => {
      item.file((file: File) => resolve([{ file, relPath: path }]))
    })
  }
  if (!item.isDirectory) return []
  const dirReader = item.createReader()
  const entries: any[] = await new Promise((resolve) => {
    const all: any[] = []
    const readNext = () => {
      dirReader.readEntries((batch: any[]) => {
        if (!batch || batch.length === 0) resolve(all)
        else {
          all.push(...batch)
          readNext()
        }
      }, () => resolve(all))
    }
    readNext()
  })
  const subFolder = path ? `${path}/${item.name}` : item.name
  const results: { file: File, relPath: string }[] = []
  for (const child of entries) results.push(...await traverseDroppedEntry(child, subFolder))
  return results
}

const handleDrop = async (e: DragEvent) => {
  e.preventDefault()
  if (!currentCampaign.value || !questAdb.isConnected.value) return
  const items = e.dataTransfer?.items
  if (items && items.length > 0 && typeof items[0]?.webkitGetAsEntry === 'function') {
    const collected: { file: File, relPath: string }[] = []
    for (let i = 0; i < items.length; i++) {
      const entry = items[i] && typeof items[i].webkitGetAsEntry === 'function' ? items[i].webkitGetAsEntry() : null
      if (entry) collected.push(...await traverseDroppedEntry(entry, ''))
    }
    if (collected.length > 0) {
      await uploadRealFiles(collected)
      return
    }
  }
  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    await uploadRealFiles(Array.from(files).map(file => ({ file })))
  }
}

const cancelFileTransfer = async () => {
  fileTransferCancelRequested.value = true
  await questAdb.cancelFilePush()
  fileTransferProgress.value = 0
  fileTransferIndeterminate.value = false
  fileTransferReceived.value = ''
  fileTransferStatusMsg.value = ''
  isTransferringFiles.value = false
}

const uploadRealFiles = async (files: Array<File | { file: File, relPath?: string }>) => {
  if (!currentCampaign.value || !questAdb.isConnected.value || files.length === 0) return
  if (!isCleanQuestDropPath(currentCampaign.value.fullPath)) return
  const normalized = files.map(entry => entry instanceof File ? entry : entry.file)
  const payloadBytes = normalized.reduce((sum, file) => sum + (file.size || 0), 0)
  spaceNotice.value = null
  const decision = await questAdb.checkFreeSpace(payloadBytes, 'files')
  if (decision.action === 'block') {
    spaceNotice.value = decision.message
    spaceNoticeKind.value = 'block'
    return
  }
  if (decision.action === 'warn') {
    spaceNotice.value = decision.message
    spaceNoticeKind.value = 'warn'
  }

  fileTransferCancelRequested.value = false
  isTransferringFiles.value = true
  fileTransferProgress.value = 0
  fileTransferIndeterminate.value = false
  fileTransferReceived.value = ''
  fileTransferStatusMsg.value = `Preparing ${files.length} file(s)...`
  const copySteps = createInstallStepLedger()
  trackInstallStep(copySteps, 'copy_game_files', 'start')
  let copyOutcome: 'ok' | 'fail' = 'ok'

  try {
    const campaignPath = currentCampaign.value.fullPath
    for (let i = 0; i < files.length; i++) {
      if (fileTransferCancelRequested.value) {
        copyOutcome = 'fail'
        return
      }
      const entry = files[i]!
      const file = entry instanceof File ? entry : entry.file
      const relPath = entry instanceof File ? file.webkitRelativePath : (entry.relPath || file.webkitRelativePath)
      const targetDir = destinationDirForDroppedFile(campaignPath, relPath, file.name)
      const currentPct = Math.round((i / files.length) * 100)
      fileTransferProgress.value = currentPct
      fileTransferStatusMsg.value = `Transferring ${file.name} (${i + 1}/${files.length})...`
      await questAdb.pushFileToPath(file, targetDir, (pct, msg, indeterminate) => {
        if (fileTransferCancelRequested.value) return
        fileTransferIndeterminate.value = Boolean(indeterminate)
        if (indeterminate) {
          const match = msg.match(/\(([^)]+)\)/)
          fileTransferReceived.value = match?.[1]?.split(' sent')[0] || ''
          fileTransferStatusMsg.value = msg
          return
        }
        const overall = Math.min(99, Math.round(((i + (pct / 100)) / files.length) * 100))
        fileTransferProgress.value = overall
        fileTransferStatusMsg.value = msg
      })
    }
    if (fileTransferCancelRequested.value) {
      copyOutcome = 'fail'
      return
    }
    fileTransferIndeterminate.value = false
    fileTransferProgress.value = 100
    fileTransferStatusMsg.value = 'Files transferred successfully!'
    if (port.value) {
      const targetKey = `${port.value.id}-${currentCampaign.value.id}`
      transferredCampaigns.value[targetKey] = true
    }
    allowFileTransferOverride.value = false
    await scanCampaignFiles()
  } catch (err: any) {
    copyOutcome = 'fail'
    if (fileTransferCancelRequested.value || isUserCancel(err)) {
      fileTransferStatusMsg.value = ''
      fileTransferProgress.value = 0
      fileTransferIndeterminate.value = false
      isTransferringFiles.value = false
      return
    }
    if (isLowSpaceError(err)) {
      spaceNotice.value = err.message
      spaceNoticeKind.value = 'block'
      fileTransferStatusMsg.value = ''
      isTransferringFiles.value = false
      return
    }
    console.error('File push failed:', err)
    fileTransferStatusMsg.value = `Error: ${err?.message || 'Failed to push files'}`
  } finally {
    trackInstallStep(copySteps, 'copy_game_files', copyOutcome)
    if (!fileTransferCancelRequested.value) {
      setTimeout(() => {
        isTransferringFiles.value = false
      }, 800)
    }
  }
}

const copyDestinationPath = async (text: string, campaignId: string) => {
  if (!import.meta.client || !text) return
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
    } else {
      const area = document.createElement('textarea')
      area.value = text
      area.setAttribute('readonly', '')
      area.style.position = 'fixed'
      area.style.left = '-9999px'
      document.body.appendChild(area)
      area.select()
      const ok = document.execCommand('copy')
      area.remove()
      if (!ok) return
    }
  } catch {
    return
  }
  copiedCampaignId.value = campaignId
  if (copiedCampaignTimer) clearTimeout(copiedCampaignTimer)
  copiedCampaignTimer = setTimeout(() => {
    copiedCampaignId.value = null
  }, 2000)
}

const renderedGuide = computed(() => {
  if (!port.value || !port.value.installation_guide) {
    return '<p class="text-muted-foreground">No installation tutorial registered for this port yet.</p>'
  }
  const parsed = marked.parse(port.value.installation_guide)
  return softenGuideHtml(typeof parsed === 'string' ? parsed : '')
})

const formatCategory = (cat: PortCategory) => {
  switch (cat) {
    case 'source_port': return 'Source Port'
    case 'decompilation': return 'Decompilation'
    case 'engine_recreation': return 'Engine Recreation'
    case 'emulator': return 'Emulator'
    case 'wrapper': return 'Wrapper / Compatibility Layer'
    case 'vr_injection': return 'VR Injection'
    case 'game_mod': return 'Game Mod'
    default: return cat
  }
}

const formatStatus = (status: PortStatus) => {
  switch (status) {
    case 'released': return 'Released'
    case 'playable_beta': return 'Beta'
    case 'in_development': return 'In Dev'
    default: return status
  }
}
</script>
