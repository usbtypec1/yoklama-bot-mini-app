<template>
  <div
      class="min-h-screen tg-secondary-bg-color flex items-start justify-center p-4"
  >
    <div
        class="tg-section-bg-color rounded-2xl shadow-2xl p-8 w-full max-w-md overflow-hidden"
    >
      <Transition name="fade-slide" mode="out-in">
        <div :key="state" class="relative min-h-[400px]">

          <!-- FORM -->
          <div v-if="state === 'form'" class="absolute inset-0 flex flex-col justify-center">
            <div class="text-center mb-8">
              <h1 class="text-3xl font-bold tg-text-color mb-2">
                Вход в Yoklama Bot
              </h1>
              <p class="tg-subtitle-text-color">Введите данные от OBIS</p>
            </div>

            <!-- Error -->
            <div
                v-if="errorMessage"
                class="mb-2 p-4 bg-red-50 border tg-destructive-outline-color rounded-lg animate-shake"
            >
              <div class="flex items-center">
                <svg
                    class="w-5 h-5 tg-destructive-text-color mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                  <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clip-rule="evenodd"
                  />
                </svg>
                <span class="tg-destructive-text-color text-sm">
                  {{ errorMessage }}
                </span>
              </div>
            </div>

            <!-- Student number -->
            <div class="mb-4">
              <label class="block text-sm font-medium tg-text-color mb-2">
                Студенческий номер
              </label>
              <input
                  v-model="studentNumber"
                  type="text"
                  class="w-full px-4 py-3 border rounded-lg tg-accent-outline-color"
                  placeholder="2204.01001"
                  @keyup.enter="onSubmit"
              />
            </div>

            <!-- Password -->
            <div class="mb-6">
              <label class="block text-sm font-medium tg-text-color mb-2">
                Пароль от OBIS
              </label>
              <input
                  v-model="password"
                  class="w-full px-4 py-3 border rounded-lg tg-accent-outline-color"
                  placeholder="yes_future123!"
                  @keyup.enter="onSubmit"
              />
            </div>

            <MainButton @click="onSubmit" :visible="state === 'form'" text="Подтвердить"/>
          </div>

          <!-- LOADING -->
          <div
              v-else-if="state === 'loading'"
              class="absolute inset-0 flex flex-col items-center justify-center"
          >
            <div class="relative">
              <div
                  class="w-20 h-20 border-8 border-purple-200 rounded-full"
              ></div>
              <div
                  class="w-20 h-20 border-8 border-purple-500 rounded-full animate-spin border-t-transparent absolute inset-0"
              ></div>
            </div>
            <p class="mt-6 tg-text-color font-medium">
              Проверка введенных данных...
            </p>
          </div>

          <!-- SUCCESS -->
          <div
              v-else
              class="absolute inset-0 flex flex-col items-center justify-center"
          >
            <div
                class="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center animate-success-pop"
            >
              <svg
                  class="w-10 h-10 text-white animate-check-draw"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  stroke-width="3"
              >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h2 class="mt-6 text-2xl font-bold text-center tg-text-color">
              Добро пожаловать!
              <br>
              {{ fullName }}
            </h2>
            <p class="mt-2 tg-subtitle-text-color text-center">
              Через пару секунд вы автоматически будете перенаправлены в бота.
            </p>
          </div>

        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MainButton, usePopup, useMiniApp, useHapticFeedback } from "vue-tg";

const { showPopup } = usePopup();
const { sendData } = useMiniApp();
const { notificationOccurred, impactOccurred } = useHapticFeedback();

const state = ref<'form' | 'loading' | 'success'>('form');
const studentNumber = ref<string>('');
const password = ref<string>('');
const errorMessage = ref<string>('');
const fullName = ref<string>('');

const storedStudentNumber = useState('studentNumber', () => '');
const storedPassword = useState('password', () => '');
const isTermsAccepted = useState('termsAccepted', () => false);

onMounted(() => {
  if (storedStudentNumber.value.length > 0) {
    studentNumber.value = storedStudentNumber.value;
  }
  if (storedPassword.value.length > 0) {
    password.value = storedPassword.value;
  }
});

const process = async () => {
  errorMessage.value = ''
  state.value = 'loading'

  impactOccurred?.("light");
  await new Promise(resolve => setTimeout(resolve, 1000));

  try {
    const responseData = await $fetch('/api/verify', {
      method: 'POST',
      body: {
        studentNumber: studentNumber.value,
        password: password.value,
      },
    })
    fullName.value = responseData.fullName
    state.value = 'success'

    await new Promise(resolve => setTimeout(resolve, 5000));
    sendData?.(JSON.stringify({ studentNumber: studentNumber.value, password: password.value }));
    notificationOccurred?.("success");
  } catch (error: any) {
    errorMessage.value =
        error?.data?.message || 'Неверно введенные данные.'
    state.value = 'form'
    notificationOccurred?.("error");
  }
}

const onSubmit = () => {
  if (isTermsAccepted.value) {
    process();
    return;
  }

  showPopup?.({
    title: "Внимание!",
    message: "Используя данный сервис, вы соглашаетесь с пользовательским соглашением.",
    buttons: [
      {
        text: "Согласен",
        id: "accept",
        type: "default",
      },
      {
        text: "Ознакомиться",
        id: "view_terms",
      },
      {
        type: "cancel",
      }
    ],
  }, async (id: string) => {
    if (id === 'accept') {
      isTermsAccepted.value = true;
      await process();
    } else if (id === 'view_terms') {
      storedStudentNumber.value = studentNumber.value;
      storedPassword.value = password.value;
      await navigateTo("terms");
    }
  })

}
</script>

<style scoped>
/* Transition */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.35s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(12px) scale(0.98);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-12px) scale(0.98);
}

/* Animations */
@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-6px);
  }
  75% {
    transform: translateX(6px);
  }
}

@keyframes successPop {
  0% {
    transform: scale(0);
  }
  60% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes checkDraw {
  from {
    stroke-dasharray: 50;
    stroke-dashoffset: 50;
  }
  to {
    stroke-dasharray: 50;
    stroke-dashoffset: 0;
  }
}

.animate-shake {
  animation: shake 0.4s ease-in-out;
}

.animate-success-pop {
  animation: successPop 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.animate-check-draw {
  animation: checkDraw 0.5s ease-out 0.3s forwards;
}

</style>
