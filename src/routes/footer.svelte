<script>
  import Icon from './icons.svelte';
</script>

<footer>
  <div class="container">
    <header>
      <img
        id="logo"
        src="/logo.png"
        alt="Matthew Jones Software Developer, logo"
      />
    </header>
    <hr />
    <a href="https://www.linkedin.com/in/matt-jones-a7b389292/" class="link">
      <Icon width={60} height={60} icon={'linkedin'} />
      <span>LinkedIn</span>
    </a>
    <a href="tel:978-979-0323" class="link">
      <Icon width={60} height={60} icon={'phone'} />
      <span>978-979-0323</span>
    </a>
    <a href="mailto:matt.jones3054@gmail.com" class="link">
      <Icon width={60} height={60} icon={'email'} />
      <span>matt.jones3054@gmail.com</span>
    </a>
    <div id="copyright">
      © Copyright 2023 Matthew A. Jones All Rights Reserved
    </div>
  </div>
</footer>

<style>
  footer {
    height: 400px;
    width: 100vw;
    background-color: var(--neutral-brown);
  }

  .container {
    height: calc(100% - 20px);
    padding: 20px 20px 0px 20px;
    overflow: hidden;
  }

  header {
    width: 100%;
    height: 50px;
    display: flex;
    flex-direction: row;
    justify-content: end;
  }

  #logo {
    width: 50px;
    height: 50px;
    margin-left: 10px;
  }

  hr {
    width: 80%;
    border: none;
    border-top: 0.5px solid var(--neutral-gray);
  }

  .link {
    width: fit-content;
    padding: 15px 100px 15px 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    color: var(--main-blue-light);
    font-size: x-large;
  }

  .link:nth-child(even) {
    color: var(--neutral-white);
    text-decoration: none;
  }

  @media (min-width: 440px) {
    .link span {
      overflow: visible;
      text-wrap: nowrap;
      padding-left: 30px;
      font-weight: bold;
      color: inherit;
    }

    #copyright {
      margin-left: auto;
      height: 10%;
      display: flex;
      align-items: end;
      width: fit-content;
      color: var(--neutral-white);
      font-size: medium;
    }
  }
  @media (max-width: 439px) {
    .link span {
      overflow: visible;
      text-wrap: nowrap;
      padding-left: 10px;
      font-size: inherit;
      font-weight: bold;
      color: inherit;
    }

    .link:last-of-type {
      font-size: small;
    }

    #copyright {
      margin-left: auto;
      height: 10%;
      display: flex;
      align-items: end;
      width: fit-content;
      color: var(--neutral-white);
      font-size: xx-small;
    }
  }

  .link:hover {
    transition: 0.5s;
    color: var(--main-blue-alt);
    background-color: var(--neutral-gray-op-10);
    border-radius: 10px;
  }
</style>
