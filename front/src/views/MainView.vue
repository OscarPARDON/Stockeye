<template>
  <div class="app">

    <div class="background-gradient"></div>

    <div class="particles">
      <div class="particle" v-for="i in 50" :key="i"></div>
    </div>

    <!-- Main content -->
    <div class="container">

      <saved-values/>

      <main class="main-content">
        <div class="hero-section">
          <h1 class="hero-title">
            Vos valeurs,
            <span class="highlight">instantanément</span>.
          </h1>

          <p class="hero-subtitle">
            Suivez les marchés financiers en temps réel avec une interface moderne et intuitive
          </p>

          <SearchBar />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
  import SearchBar from '../components/SearchBar.vue';
  import SavedValues from "../components/SavedValues.vue";
</script>

<style scoped>
.app {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
}

.background-gradient {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg,
    #0f0f23 0%,
    #1a1a2e 25%,
    #16213e 50%,
    #0f3460 75%,
    #533483 100%
  );
  z-index: -2;
}

.particles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.particle {
  position: absolute;
  width: 2px;
  height: 2px;
  background: rgba(139, 69, 255, 0.6);
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
}

.particle:nth-child(odd) {
  background: rgba(59, 130, 246, 0.4);
  animation-duration: 8s;
}

.particle:nth-child(3n) {
  background: rgba(168, 85, 247, 0.5);
  animation-duration: 10s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0;
  }
  10% { opacity: 1; }
  90% { opacity: 1; }
  50% {
    transform: translateY(-100px) rotate(180deg);
  }
}

.container {
  display: flex;
  min-height: 100vh;
  position: relative;
  z-index: 1;
}

.main-content {
  flex: 1;
  display: flex;
  align-items: start;
  justify-content: center;
  padding: 2rem;
}

.hero-section {
  text-align: center;
  max-width: 800px;
  width: 100%;
}

.hero-title {
  font-family: 'Orbitron', monospace;
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: 900;
  color: #ffffff;
  margin-bottom: 1rem;
  line-height: 1.1;
  text-shadow: 0 0 30px rgba(139, 69, 255, 0.5);
  letter-spacing: -0.02em;
}

.highlight {
  background: linear-gradient(135deg, #8b45ff, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
  from {
    text-shadow: 0 0 20px rgba(139, 69, 255, 0.5);
  }
  to {
    text-shadow: 0 0 30px rgba(139, 69, 255, 0.8), 0 0 40px rgba(59, 130, 246, 0.5);
  }
}

.hero-subtitle {
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 3rem;
  font-weight: 400;
  letter-spacing: 0.5px;
}

@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }

  .main-content {
    padding: 1rem;
  }

  .hero-section {
    text-align: center;
    margin-top : 5rem;
    width: 100%;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }
}

/* Random positions for particles */
.particle:nth-child(1) { left: 10%; animation-delay: 0s; }
.particle:nth-child(2) { left: 20%; animation-delay: 0.5s; }
.particle:nth-child(3) { left: 30%; animation-delay: 1s; }
.particle:nth-child(4) { left: 40%; animation-delay: 1.5s; }
.particle:nth-child(5) { left: 50%; animation-delay: 2s; }
.particle:nth-child(6) { left: 60%; animation-delay: 2.5s; }
.particle:nth-child(7) { left: 70%; animation-delay: 3s; }
.particle:nth-child(8) { left: 80%; animation-delay: 3.5s; }
.particle:nth-child(9) { left: 90%; animation-delay: 4s; }
.particle:nth-child(10) { left: 15%; animation-delay: 4.5s; }
</style>