<script lang="ts">
  interface Props {
    value?: string;
    itemCount?: number;
    requiredCount?: number;
    onValueChange?: (value: string) => void;
  }

  let { value = '', itemCount = 0, requiredCount = 16, onValueChange = () => {} }: Props = $props();
</script>

<section class="panel items-panel" aria-labelledby="items-heading">
  <div class="panel-heading">
    <h2 id="items-heading">항목</h2>
    <p class:item-warning={itemCount < requiredCount}>{itemCount} / 최소 {requiredCount}개</p>
  </div>

  <textarea
    {value}
    spellcheck="false"
    placeholder="한 줄에 하나씩 입력&#10;예: apple&#10;banana&#10;orange"
    oninput={(event) => onValueChange(event.currentTarget.value)}
  ></textarea>
</section>

