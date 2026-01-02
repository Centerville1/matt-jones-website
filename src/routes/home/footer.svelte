<script>
  import { themeMode } from '../../store';
  import ThemeCycler from '$lib/components/ThemeCycler.svelte';

  /** @type {FileRecord | null} */
  export let resume = null;

  /** @type {string} */
  let mode;

  themeMode.subscribe((value) => {
    mode = value;
  });

  let formStatus = 'idle'; // idle, submitting, success, error
  let formError = '';
  let formData = {
    name: '',
    email: '',
    message: '',
  };

  /**
   * Handle contact form submission
   * @param {Event} e
   */
  async function handleSubmit(e) {
    e.preventDefault();
    formStatus = 'submitting';
    formError = '';

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to send message');
      }

      formStatus = 'success';
      formData = { name: '', email: '', message: '' };
      setTimeout(() => {
        formStatus = 'idle';
      }, 5000);
    } catch (err) {
      formStatus = 'error';
      formError = err instanceof Error ? err.message : 'Failed to send message';
    }
  }

  function scrollTop() {
    let main = document.getElementsByTagName('main')[0];
    if (main !== null) {
      main.scrollTop = 0;
    }
  }
</script>

<footer>
  <div class="container">
    <div class="divider"></div>
    <!-- Contact Form Section -->
    <section class="contact-section">
      <h2>Get in Touch</h2>
      <p class="section-description">
        Have a question or want to work together? Send me a message!
      </p>

      {#if formStatus === 'success'}
        <div class="alert success">
          <strong>Message sent!</strong> Thank you for reaching out. I'll get back
          to you soon.
        </div>
      {:else if formStatus === 'error'}
        <div class="alert error">
          <strong>Error:</strong>
          {formError}
        </div>
      {/if}

      <form on:submit={handleSubmit} class="contact-form">
        <div class="form-group">
          <input
            type="text"
            id="name"
            bind:value={formData.name}
            required
            disabled={formStatus === 'submitting'}
            placeholder="Name"
          />
        </div>

        <div class="form-group">
          <input
            type="email"
            id="email"
            bind:value={formData.email}
            required
            disabled={formStatus === 'submitting'}
            placeholder="Email"
          />
        </div>

        <div class="form-group">
          <textarea
            id="message"
            bind:value={formData.message}
            required
            disabled={formStatus === 'submitting'}
            rows="5"
            placeholder="Message"
          ></textarea>
        </div>

        <div class="form-actions">
          <button type="submit" disabled={formStatus === 'submitting'}>
            {formStatus === 'submitting' ? 'Sending...' : 'Submit'}
          </button>
        </div>
      </form>
    </section>

    <!-- Resume Download & Navigation Section -->
    <section class="info-section">
      {#if resume}
        <div class="resume-download">
          <a href={resume.path} target="_blank" class="resume-link">
            <span class="resume-icon">📄</span>
            View Resume
          </a>
        </div>
      {/if}
    </section>

    <div class="divider"></div>

    <section class="info-section">
      <div class="nav-container">
        <nav class="footer-nav">
          <a href="/home" on:click={scrollTop}>Home</a>
          <span class="nav-separator">|</span>
          <a href="/home/blog" on:click={scrollTop}>Blog</a>
          <span class="nav-separator">|</span>
          <div class="portfolio-section">
            <a href="/home/projects" on:click={scrollTop}>Portfolio</a>
            <a
              href="/home/projects#other"
              class="branding"
              on:click={scrollTop}
            >
              Web Creations
            </a>
          </div>
        </nav>
      </div>

      <div class="theme-section">
        <ThemeCycler />
      </div>

      <div class="github-section">
        <p>Check out the project on:</p>
        <a
          href="https://github.com/Centerville1/matt-jones-website"
          class="github-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          {#if mode === 'dark'}
            <img src="/social-logos/github-dark.png" alt="Github" />
          {:else}
            <img src="/social-logos/github.png" alt="Github" />
          {/if}
          <span>GitHub</span>
        </a>
      </div>
    </section>
  </div>
  <div class="copyright">© 2026 Matthew A. Jones All Rights Reserved</div>
</footer>

<style>
  footer {
    position: relative;
    width: 100vw;
    background-color: var(--neutral-white);
  }

  .container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 2rem 2rem 2rem;
    position: relative;
  }

  .contact-section {
    margin-bottom: 3rem;
    transform: translateY(100px);
    opacity: 0;
    animation: slide-up cubic-bezier(0.58, 0, 0.48, 0.9) forwards;
    animation-timeline: view();
    animation-range-start: 10vh;
    animation-range-end: 60vh;
  }

  h2 {
    margin: 0 0 0.5rem 0;
    font-size: 2rem;
    color: var(--contrast-text-light);
    text-align: center;
  }

  .section-description {
    text-align: center;
    color: var(--contrast-text-light);
    opacity: 0.7;
    margin: 0 0 2rem 0;
  }

  .alert {
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    text-align: center;
  }

  .alert.success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }

  .alert.error {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }

  .contact-form {
    max-width: 600px;
    margin: 0 auto;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  input,
  textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--neutral-dark-gray);
    border-radius: 8px;
    font-family: inherit;
    font-size: 1rem;
    background-color: var(--neutral-white);
    color: var(--contrast-text-light);
    transition: border-color 0.2s;
  }

  input:focus,
  textarea:focus {
    outline: none;
    border-color: var(--main-blue);
  }

  input:disabled,
  textarea:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  textarea {
    resize: vertical;
    min-height: 120px;
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
  }

  button[type='submit'] {
    padding: 0.5rem 1.5rem;
    font-size: 1rem;
    font-weight: 600;
    background: transparent;
    color: var(--neutral-black);
    border: none;
    border-bottom: 2px solid var(--main-blue);
    border-radius: 0;
    cursor: pointer;
    transition:
      color 0.2s,
      border-color 0.2s,
      transform 0.2s;
  }

  button[type='submit']:hover:not(:disabled) {
    color: var(--neutral-black);
    border-bottom-color: var(--main-blue-light);
    transform: scale(1.05);
  }

  button[type='submit']:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .divider {
    height: 2px;
    background: linear-gradient(
      to right,
      transparent,
      var(--main-blue-light),
      transparent
    );
    margin: 2rem 0;
    transform: scaleX(0);
    opacity: 0;
    animation: expand-horizontal cubic-bezier(0.58, 0, 0.48, 0.9) forwards;
    animation-timeline: view();
    animation-range-start: 0vh;
    animation-range-end: 25vh;
  }

  .info-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    transform: translateY(100px);
    opacity: 0;
    animation: slide-up cubic-bezier(0.58, 0, 0.48, 0.9) forwards;
    animation-timeline: view();
    animation-range-start: 5vh;
    animation-range-end: 25vh;
  }

  .resume-download {
    display: flex;
    justify-content: center;
  }

  .resume-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 2rem;
    font-size: 1.1rem;
    font-weight: 600;
    background: transparent;
    color: var(--neutral-black);
    border: 2px solid var(--main-blue);
    border-radius: 10px;
    text-decoration: none;
    cursor: pointer;
    transition:
      color 0.2s,
      border-color 0.2s,
      transform 0.2s;
  }

  .resume-link:hover {
    color: var(--neutral-black);
    border-color: var(--main-blue-light);
    transform: translateY(-2px);
  }

  .resume-icon {
    font-size: 1.5rem;
  }

  .nav-container {
    display: flex;
    justify-content: center;
  }

  .footer-nav {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    font-size: 1.1rem;
    font-weight: 600;
  }

  .footer-nav > a {
    color: var(--main-blue);
    text-decoration: none;
    transition: color 0.2s;
  }

  .footer-nav > a:hover {
    color: var(--main-blue-light);
  }

  .nav-separator {
    color: var(--neutral-dark-gray);
  }

  .portfolio-section {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .portfolio-section > a {
    color: var(--main-blue);
    text-decoration: none;
    transition: color 0.2s;
  }

  .portfolio-section > a:hover {
    color: var(--main-blue-light);
  }

  .branding {
    font-size: 0.875rem;
    font-weight: 400;
  }

  .theme-section {
    display: flex;
    justify-content: center;
  }

  .github-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .github-section p {
    margin: 0;
    color: var(--contrast-text-light);
  }

  .github-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1.5rem;
    background-color: var(--neutral-dark-gray);
    border-radius: 8px;
    text-decoration: none;
    color: var(--contrast-text-light);
    font-weight: 600;
    transition: background-color 0.2s;
  }

  .github-link:hover {
    background-color: var(--neutral-dark-gray-op-50);
  }

  .github-link img {
    width: 32px;
    height: 32px;
  }

  .copyright {
    position: absolute;
    right: 10px;
    bottom: 10px;
    text-align: right;
    color: var(--neutral-black);
    font-size: 0.875rem;
  }

  @keyframes slide-up {
    to {
      transform: translateY(0px);
      opacity: 1;
    }
  }

  @keyframes expand-horizontal {
    to {
      transform: scaleX(1);
      opacity: 1;
    }
  }

  @media (max-width: 439px) {
    .container {
      padding: 2rem 1rem 1.5rem 1rem;
    }

    h2 {
      font-size: 1.5rem;
    }

    .footer-nav {
      flex-wrap: wrap;
      justify-content: center;
      font-size: 1rem;
    }

    .copyright {
      text-align: center;
      font-size: 0.75rem;
    }
  }
</style>
