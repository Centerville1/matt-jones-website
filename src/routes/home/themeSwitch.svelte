<!-- Based on https://www.w3schools.com/howto/howto_css_switch.asp -->
<script>
  import '../modeSwitcher.svelte';
  import { themeMode } from '../../store';
  import { onMount } from 'svelte';

  /**
   * @type {boolean}
   */
  let darkMode;

  const setMode = themeMode.subscribe((value) => {
    // console.log('setting mode');
    darkMode = value === 'dark';
  });

  /**
   * @param {boolean} darkMode
   */
  function updateTheme(darkMode) {
    // console.log('updating theme', darkMode ? 'dark' : 'light');
    themeMode.update((n) => (darkMode ? 'dark' : 'light'));
  }

  onMount(setMode);

  $: updateTheme(darkMode);
</script>

<label class="switch">
  <input type="checkbox" bind:checked={darkMode} />
  <span class="slider"></span>
</label>

<style>
  /* The switch - the box around the slider */
  .switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
  }

  /* Hide default HTML checkbox */
  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  /* The slider track */
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      rgba(253, 242, 45, 1) 0%,
      rgba(149, 143, 27, 1) 61%,
      rgba(0, 0, 0, 1) 100%
    );
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 34px;
  }

  /* The slider ball */
  .slider:before {
    position: absolute;
    content: '';
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: var(--constant-white);
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 50%;
  }

  /* The slider track when checked */
  input:checked + .slider {
    /* background-color: #2196f3; */
  }

  input:focus + .slider {
    box-shadow: 0 0 1px #2196f3;
  }

  input:checked + .slider:before {
    background-color: var(--constant-black);
    transform: translateX(26px);
  }
</style>
