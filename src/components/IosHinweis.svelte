<script lang="ts">
  import { T } from '../lib/texte';

  // iPadOS meldet sich als Mac – daher zusätzlich Touch prüfen.
  const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.userAgent.includes('Mac') && navigator.maxTouchPoints > 1);
</script>

{#if ios}<p class="hinweis">🔕 {T.ios}</p>{/if}
