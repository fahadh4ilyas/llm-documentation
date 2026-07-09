/**
 * Navigation data for LLM Documentation SPA
 */

const NAVS = {
  empty: { url: [], text: '', class: '' },
  'llm-documentation': { url: [''], text: 'LLM Documentation', class: 'ml-0' },
  pendahuluan: { url: ['pendahuluan'], text: 'Pendahuluan', class: 'ml-3' },
  'spesifikasi-komputer': { url: ['spesifikasi-komputer'], text: 'Spesifikasi Komputer', class: 'ml-3' },
  'persiapan-komputer': { url: ['persiapan-komputer'], text: 'Persiapan Komputer', class: 'ml-3' },
  'instalasi-nvidia-driver-cuda-toolkit': { url: ['persiapan-komputer', '1-instalasi-nvidia-driver-cuda-toolkit'], text: '1. Instalasi Nvidia Driver & Cuda Toolkit', class: 'ml-4' },
  'nvidia-driver': { url: ['persiapan-komputer', '1-instalasi-nvidia-driver-cuda-toolkit'], fragment: 'nvidia-driver', text: 'Nvidia Driver', class: 'ml-5' },
  'cuda-toolkit': { url: ['persiapan-komputer', '1-instalasi-nvidia-driver-cuda-toolkit'], fragment: 'cuda-toolkit', text: 'Cuda Toolkit', class: 'ml-5' },
  'instalasi-docker-optional': { url: ['persiapan-komputer', '2-instalasi-docker-optional'], text: '2. Instalasi Docker (optional)', class: 'ml-4' },
  'instalasi-anaconda': { url: ['persiapan-komputer', '3-instalasi-anaconda'], text: '3. Instalasi Anaconda', class: 'ml-4' },
  'proses-load-llm': { url: ['proses-load-llm'], text: 'Proses Load LLM', class: 'ml-3' },
  'proses-inference-llm': { url: ['proses-inference-llm'], text: 'Proses Inference LLM', class: 'ml-3' },
  'deploy-dengan-vllm': { url: ['proses-inference-llm', '1-deploy-dengan-vllm'], text: '1. Deploy Dengan vLLM', class: 'ml-4' },
  'interaksi-dengan-vllm': { url: ['proses-inference-llm', '2-interaksi-dengan-vllm'], text: '2. Interaksi Dengan vLLM', class: 'ml-4' }
};

const SIDENAVS = [
  NAVS.pendahuluan,
  NAVS['spesifikasi-komputer'],
  NAVS['persiapan-komputer'],
  NAVS['instalasi-nvidia-driver-cuda-toolkit'],
  NAVS['nvidia-driver'],
  NAVS['cuda-toolkit'],
  NAVS['instalasi-docker-optional'],
  NAVS['instalasi-anaconda'],
  NAVS['proses-load-llm'],
  NAVS['proses-inference-llm'],
  NAVS['deploy-dengan-vllm'],
  NAVS['interaksi-dengan-vllm']
];

const BOTTOMLINKS = {
  home: { left: NAVS.empty, center: NAVS.empty, right: NAVS.pendahuluan },
  pendahuluan: { left: NAVS['llm-documentation'], center: NAVS['llm-documentation'], right: NAVS['spesifikasi-komputer'] },
  'spesifikasi-komputer': { left: NAVS.pendahuluan, center: NAVS['llm-documentation'], right: NAVS['persiapan-komputer'] },
  'persiapan-komputer': { left: NAVS['spesifikasi-komputer'], center: NAVS['llm-documentation'], right: NAVS['instalasi-nvidia-driver-cuda-toolkit'] },
  '1-instalasi-nvidia-driver-cuda-toolkit': { left: NAVS['persiapan-komputer'], center: NAVS['llm-documentation'], right: NAVS['instalasi-docker-optional'] },
  '2-instalasi-docker-optional': { left: NAVS['instalasi-nvidia-driver-cuda-toolkit'], center: NAVS['llm-documentation'], right: NAVS['instalasi-anaconda'] },
  '3-instalasi-anaconda': { left: NAVS['instalasi-docker-optional'], center: NAVS['llm-documentation'], right: NAVS['proses-load-llm'] },
  'proses-load-llm': { left: NAVS['instalasi-anaconda'], center: NAVS['llm-documentation'], right: NAVS['proses-inference-llm'] },
  'proses-inference-llm': { left: NAVS['proses-load-llm'], center: NAVS['llm-documentation'], right: NAVS['deploy-dengan-vllm'] },
  '1-deploy-dengan-vllm': { left: NAVS['proses-inference-llm'], center: NAVS['llm-documentation'], right: NAVS['interaksi-dengan-vllm'] },
  '2-interaksi-dengan-vllm': { left: NAVS['deploy-dengan-vllm'], center: NAVS['llm-documentation'], right: NAVS.empty }
};

const PAGE_MAP = {
  '': 'pages/home.html',
  'pendahuluan': 'pages/pendahuluan.html',
  'spesifikasi-komputer': 'pages/spesifikasi-komputer.html',
  'persiapan-komputer': 'pages/persiapan-komputer/index.html',
  'persiapan-komputer/1-instalasi-nvidia-driver-cuda-toolkit': 'pages/persiapan-komputer/1-instalasi-nvidia-driver-cuda-toolkit.html',
  'persiapan-komputer/2-instalasi-docker-optional': 'pages/persiapan-komputer/2-instalasi-docker-optional.html',
  'persiapan-komputer/3-instalasi-anaconda': 'pages/persiapan-komputer/3-instalasi-anaconda.html',
  'proses-load-llm': 'pages/proses-load-llm.html',
  'proses-inference-llm': 'pages/proses-inference-llm/index.html',
  'proses-inference-llm/1-deploy-dengan-vllm': 'pages/proses-inference-llm/1-deploy-dengan-vllm.html',
  'proses-inference-llm/2-interaksi-dengan-vllm': 'pages/proses-inference-llm/2-interaksi-dengan-vllm.html'
};

const PAGE_META = {
  '': {
    title: 'LLM Documentation — LLM Docs',
    description: 'Dokumentasi lengkap persiapan komputer untuk LLM: instalasi Nvidia Driver, Cuda Toolkit, Docker, load model, dan inference menggunakan vLLM.',
    keywords: 'LLM, dokumentasi, Nvidia Driver, Cuda Toolkit, Docker, vLLM, inference, load model, fine tune, Indonesia'
  },
  'pendahuluan': {
    title: 'Pendahuluan — LLM Docs',
    description: 'Pendahuluan dokumentasi persiapan komputer untuk LLM. Panduan instalasi driver, toolkit, dan environment untuk load, inference, dan fine tune LLM.',
    keywords: 'LLM, pendahuluan, persiapan komputer, GPU, VRAM, inference, fine tune'
  },
  'spesifikasi-komputer': {
    title: 'Spesifikasi Komputer — LLM Docs',
    description: 'Spesifikasi komputer yang dibutuhkan untuk menjalankan LLM. Rekomendasi GPU, VRAM, CPU, dan RAM untuk proses load, inference, dan fine tune.',
    keywords: 'spesifikasi komputer LLM, GPU, VRAM, Nvidia RTX, RAM, CPU'
  },
  'persiapan-komputer': {
    title: 'Persiapan Komputer — LLM Docs',
    description: 'Persiapan komputer untuk LLM: instalasi Nvidia Driver, Cuda Toolkit, Docker, dan Anaconda pada Ubuntu 22.04.',
    keywords: 'persiapan komputer, Nvidia Driver, Cuda Toolkit, Docker, Anaconda, Ubuntu'
  },
  'persiapan-komputer/1-instalasi-nvidia-driver-cuda-toolkit': {
    title: '1. Instalasi Nvidia Driver & Cuda Toolkit — LLM Docs',
    description: 'Langkah-langkah instalasi Nvidia Driver terbaru dan Cuda Toolkit untuk persiapan komputer LLM pada Ubuntu 22.04.',
    keywords: 'Nvidia Driver, Cuda Toolkit, instalasi, Ubuntu, GPU, cuda-keyring'
  },
  'persiapan-komputer/2-instalasi-docker-optional': {
    title: '2. Instalasi Docker — LLM Docs',
    description: 'Panduan instalasi Docker pada Ubuntu 22.04 untuk persiapan environment LLM, termasuk konfigurasi NVIDIA Container Toolkit.',
    keywords: 'Docker, instalasi, Ubuntu, container, NVIDIA Container Toolkit, GPU'
  },
  'persiapan-komputer/3-instalasi-anaconda': {
    title: '3. Instalasi Anaconda — LLM Docs',
    description: 'Instalasi Anaconda sebagai Python environment manager untuk persiapan komputer LLM. Membuat isolated environment untuk proyek ML.',
    keywords: 'Anaconda, instalasi, Python environment, conda, package manager'
  },
  'proses-load-llm': {
    title: 'Proses Load LLM — LLM Docs',
    description: 'Panduan mengunduh model LLM dari Hugging Face menggunakan huggingface-hub. Membuat token akses, download model, dan verifikasi.',
    keywords: 'load LLM, Hugging Face, download model, huggingface-hub, token akses'
  },
  'proses-inference-llm': {
    title: 'Proses Inference LLM — LLM Docs',
    description: 'Panduan inference LLM menggunakan vLLM: deploy model, OpenAI-compatible API, Swagger, dan parameter chat completions.',
    keywords: 'inference LLM, vLLM, deploy, OpenAI API, chat completions, Swagger'
  },
  'proses-inference-llm/1-deploy-dengan-vllm': {
    title: '1. Deploy Dengan vLLM — LLM Docs',
    description: 'Langkah-langkah deploy LLM menggunakan vLLM: instalasi, konfigurasi GPU, served-model-name, dan verifikasi endpoint health.',
    keywords: 'deploy vLLM, instalasi vLLM, GPU, served-model-name, health check, OpenAI server'
  },
  'proses-inference-llm/2-interaksi-dengan-vllm': {
    title: '2. Interaksi Dengan vLLM — LLM Docs',
    description: 'Berinteraksi dengan LLM melalui vLLM API: Swagger UI, parameter chat completions, tools, streaming, dan OpenAI compatibility.',
    keywords: 'interaksi vLLM, chat completions, tools, streaming, Swagger, OpenAI API, function calling'
  }
};
