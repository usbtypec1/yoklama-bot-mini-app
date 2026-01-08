<script setup lang="ts">
import { MainButton } from "vue-tg";
</script>
<template>
  <div
      class="min-h-screen tg-secondary-bg-color flex items-center justify-center p-4"
  >
    <div
        class="tg-section-bg-color rounded-2xl shadow-2xl p-8 w-full max-w-3xl animate-fade-in"
    >
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold tg-text-color mb-2">
          Пользовательское соглашение
        </h1>
        <p class="tg-hint-color">
          @manas_yoklama_bot
        </p>
      </div>

      <!-- Content -->
      <div class="space-y-5 tg-text-color leading-relaxed text-sm md:text-base">
        <p>
          Используя данный сервис, пользователь подтверждает своё добровольное
          согласие на предоставление и обработку своих учетных данных системы
          <span class="font-semibold">OBIS</span>.
        </p>

        <p>
          Пользователь осознаёт и принимает, что передаёт свои данные
          исключительно по собственной инициативе и на свой риск.
        </p>

        <p>
          Разработчик сервиса не несёт ответственности за любые прямые или
          косвенные последствия, убытки или иные результаты использования
          сервиса при любых обстоятельствах.
        </p>

        <p>
          Все полученные данные хранятся в
          <span class="font-semibold">зашифрованном виде</span>,
          с применением разумных и достаточных мер безопасности,
          и не передаются третьим лицам.
        </p>

        <p>
          Сервис использует данные
          <span class="font-semibold">только для чтения</span>
          и исключительно со следующих веб-страниц системы OBIS:
        </p>

        <ul class="list-disc list-inside pl-2 tg-accent-text-color">
          <li>
            <a
                href="https://obistest.manas.edu.kg/vs-ders/taken-lessons"
                target="_blank"
                class="break-all"
            >
              https://obistest.manas.edu.kg/vs-ders/taken-lessons
            </a>
          </li>
          <li>
            <a
                href="https://obistest.manas.edu.kg/vs-ders/taken-grades"
                target="_blank"
                class="break-all"
            >
              https://obistest.manas.edu.kg/vs-ders/taken-grades
            </a>
          </li>
        </ul>

        <p>
          Полученные данные используются только в рамках функционала сервиса
          и не применяются для иных целей.
        </p>

        <p>
          Исходный код проекта является открытым и доступен для ознакомления
          по ссылке:
          <a
              href="https://github.com/usbtypec1/yoklama-bot"
              target="_blank"
              class="tg-accent-text-color break-all"
          >
            https://github.com/usbtypec1/yoklama-bot
          </a>
        </p>

        <p class="font-medium tg-subtitle-text-color">
          Продолжая использование сервиса, пользователь подтверждает,
          что ознакомился с условиями, понимает их и полностью принимает.
        </p>
      </div>

      <!-- Footer -->
      <div class="mt-10 text-center text-xs tg-hint-color">
        © {{ new Date().getFullYear() }} manas_yoklama_bot
      </div>
    </div>
  </div>
  <MainButton @click="navigateTo('enter-credentials')" text="Назад"/>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}
</style>
