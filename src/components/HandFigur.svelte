<script lang="ts">
  import { altText, figurSvg } from '../lib/handzeichen';
  import type { SilbenId } from '../lib/theorie';

  let { id, beschriftet = false }: { id: SilbenId; beschriftet?: boolean } = $props();
</script>

<span class="figur" role="img" aria-label={altText(id)}>{@html figurSvg(id)}</span>
{#if beschriftet}<span class="beschriftung">{id}</span>{/if}

<style>
  .figur {
    display: block;
    width: 100%;
  }
  .figur :global(svg) {
    display: block;
    width: 100%;
    height: auto;
  }
  .beschriftung {
    display: block;
    text-align: center;
    font-family: 'Roboto Slab', Georgia, serif;
    font-weight: 800;
    font-size: 1.2rem;
    color: var(--primaer);
  }
</style>
