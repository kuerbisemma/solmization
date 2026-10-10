<script lang="ts">
  import { IST_IOS } from '../lib/klang';
  import { T } from '../lib/texte';
</script>

{#if IST_IOS}<p class="hinweis">🔕 {T.ios}</p>{/if}
