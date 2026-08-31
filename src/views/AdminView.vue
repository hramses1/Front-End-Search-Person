<template>
  <div class="dashboard-wrapper font-primary min-h-screen flex overflow-hidden relative selection:bg-[var(--accent-color)]/30">
    <!-- Capas Atmosféricas -->
    <div class="absolute inset-0 pointer-events-none noise-overlay z-0 text-[var(--text-muted)]"></div>
    <div class="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <div class="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-[var(--accent-color)]/5 blur-[120px] rounded-full"></div>
      <div class="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-[var(--accent-color)]/3 blur-[100px] rounded-full"></div>
    </div>

    <!-- Botón Hamburguesa Móvil -->
    <button 
      @click="isSidebarOpen = !isSidebarOpen"
      class="lg:hidden fixed top-4 right-4 z-50 p-md glass-panel rounded-base text-[var(--accent-color)] shadow-xl active:scale-90 transition-transform"
    >
      <svg v-if="!isSidebarOpen" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
      <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
    </button>
    
    <!-- Overlay Móvil -->
    <transition enter-active-class="duration-base ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="isSidebarOpen" @click="isSidebarOpen = false" class="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"></div>
    </transition>
    
    <!-- Sidebar -->
    <aside 
      :class="['fixed inset-y-0 left-0 z-40 w-72 transition-all duration-base lg:relative lg:translate-x-0 flex flex-col h-screen glass-panel', isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0']"
    >
      <div class="p-lg border-b border-[var(--border-color)]">
        <BrandMark prefijo="Portal " titulo="Administración" apilado />
      </div>

      <div class="flex-1 overflow-y-auto p-md space-y-md custom-scrollbar">
        <p class="text-overline font-bold tracking-[0.14em] mb-md text-[var(--text-muted)] uppercase px-sm">Navegación</p>
        <button 
          @click="router.push('/dashboard')"
          class="w-full flex items-center justify-between px-lg py-md rounded-base text-body font-bold tracking-[0.14em] text-[var(--text-secondary)] hover:bg-white/5 hover:translate-x-1 transition-all"
        >
          <span>← VOLVER AL PANEL</span>
        </button>
      </div>

      <div class="p-md border-t border-[var(--border-color)] bg-black/10">
        <button @click="handleLogout" class="w-full py-sm text-red-400 hover:bg-red-500/5 text-overline font-bold tracking-[0.14em] rounded-base border border-red-500/10 hover:border-red-500/20 transition-all uppercase mb-md">
          Cerrar Sesión Admin
        </button>

        <SecuritySeals class="mt-md" />
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col h-screen relative z-10 p-lg sm:p-xl overflow-y-auto custom-scrollbar animate-fade-in">
      <header class="mb-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
        <div>
          <p class="text-overline font-black tracking-[0.14em] text-[var(--accent-color)] uppercase mb-xs">Panel de Control</p>
          <h1 class="text-h3 font-light tracking-tight text-[var(--text-primary)] uppercase">Gestión de Usuarios</h1>
        </div>
        
        <div class="flex items-center gap-md">
            <div class="flex flex-col items-end">
                <span class="text-body font-bold tracking-[0.14em] text-[var(--text-primary)]">{{ userName }}</span>
                <span class="text-caption font-black tracking-[0.14em] text-[var(--accent-color)] opacity-80">ADMINISTRADOR</span>
            </div>
            <div class="w-9 h-9 rounded-base bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-body font-black text-white shadow-lg shadow-amber-500/20">
                {{ userName.substring(0, 2).toUpperCase() }}
            </div>
        </div>
      </header>

      <!-- Users Table -->
      <div class="flex-1">
          <div class="glass-card overflow-hidden">
            <div class="px-lg py-md border-b border-[var(--border-color)] flex flex-wrap justify-between items-center gap-md bg-[var(--surface-color)]/50">
              <div class="flex items-center gap-sm">
                <button
                  v-for="t in pestanas" :key="t.valor"
                  type="button" class="chip"
                  :aria-pressed="pestana === t.valor"
                  @click="pestana = t.valor"
                >{{ t.texto }}</button>
              </div>

              <button
                @click="pestana === 'usuarios' ? fetchUsers() : fetchPlanes()"
                :disabled="isLoading"
                class="flex items-center gap-sm text-caption font-bold tracking-[0.14em] uppercase hover:text-[var(--accent-color)] transition-all disabled:text-[var(--text-muted)]"
              >
                <span v-if="isLoading" class="w-3 h-3 border-2 border-t-transparent rounded-full animate-spin border-[var(--accent-color)]"></span>
                <span v-else>↻</span>
                Refrescar
              </button>
            </div>

            <template v-if="pestana === 'usuarios'">
            <p
              v-if="loadError"
              class="mb-md rounded-base border border-amber-500/20 bg-amber-500/5 px-md py-md text-caption leading-relaxed tracking-wide text-amber-500"
            >
              {{ loadError }}
            </p>

            <!--
              Filtros. Se aplican en cliente: el listado llega entero.

              Etiquetas fijas encima de cada campo, NO el patron flotante de
              .custom-input: ese depende de :placeholder-shown, pseudoclase que
              un input de tipo date nunca cumple porque siempre muestra valor,
              de modo que el rotulo se quedaria montado sobre el dato. Con
              etiquetas fijas los cuatro campos alinean ademas por arriba.
            -->
            <div class="px-lg pt-lg pb-lg space-y-lg border-b border-[var(--border-color)]">
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
                <div v-for="f in campos" :key="f.id" class="space-y-sm">
                  <label
                    :for="f.id"
                    class="!static !translate-y-0 !scale-100 block text-overline font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]"
                  >
                    {{ f.etiqueta }}
                  </label>
                  <input
                    :id="f.id"
                    :type="f.tipo"
                    :min="f.min"
                    :value="f.valor.value"
                    class="w-full min-h-[48px] bg-transparent border-b border-[var(--border-color)] py-sm outline-none font-body text-body text-[var(--text-primary)] transition-colors focus:border-[var(--accent-color)]"
                    @input="f.actualiza(($event.target as HTMLInputElement).value)"
                  />
                </div>
              </div>

              <div v-if="planesEnUso.length > 1" class="flex flex-wrap items-center gap-sm">
                <span class="text-overline font-bold uppercase tracking-[0.14em] text-[var(--text-muted)] w-16 shrink-0">Plan</span>
                <button
                  v-for="pl in planesEnUso" :key="pl"
                  type="button" class="chip"
                  :aria-pressed="filtroPlan === pl"
                  @click="filtroPlan = filtroPlan === pl ? '' : pl"
                >{{ pl }}</button>
              </div>

              <div class="flex flex-wrap items-center gap-sm">
                <span class="text-overline font-bold uppercase tracking-[0.14em] text-[var(--text-muted)] w-16 shrink-0">Orden</span>
                <button
                  v-for="o in ordenes" :key="o.valor"
                  type="button" class="chip"
                  :aria-pressed="orden === o.valor"
                  @click="orden = o.valor"
                >{{ o.texto }}</button>
              </div>

              <div class="flex items-center justify-between gap-md">
                <p class="text-overline uppercase tracking-[0.14em] text-[var(--text-muted)]">
                  {{ usuariosFiltrados.length }} de {{ users.length }} usuarios
                </p>
                <button v-if="hayFiltros" type="button" class="btn-tertiary" @click="limpiarFiltros">
                  Quitar filtros
                </button>
              </div>
            </div>

            <div class="overflow-x-auto custom-scrollbar">
              <table class="w-full text-left border-collapse border-b border-[var(--border-color)]">
                <thead>
                  <tr class="border-b border-[var(--border-color)] bg-black/5">
                    <th class="px-lg py-md text-caption font-black uppercase tracking-[0.14em] text-[var(--text-muted)]">Usuario</th>
                    <th class="px-lg py-md text-caption font-black uppercase tracking-[0.14em] text-[var(--text-muted)]">Plan</th>
                    <th class="px-lg py-md text-caption font-black uppercase tracking-[0.14em] text-[var(--text-muted)]">Peticiones</th>
                    <th class="px-lg py-md text-caption font-black uppercase tracking-[0.14em] text-[var(--text-muted)]">Registro</th>
                    <th class="px-lg py-md text-caption font-black uppercase tracking-[0.14em] text-[var(--text-muted)] text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[var(--border-color)]">
                  <tr v-if="!isLoading && usuariosFiltrados.length === 0">
                    <td colspan="5" class="px-lg py-2xl text-center text-body text-[var(--text-muted)]">
                      {{ users.length === 0 ? 'No hay usuarios que mostrar.' : 'Ningún usuario coincide con los filtros.' }}
                    </td>
                  </tr>
                  <tr v-for="userItem in usuariosVisibles" :key="userItem.userId" class="hover:bg-white/[0.02] transition-colors group">
                    <td class="px-lg py-md">
                      <div class="flex flex-col min-w-0" :title="`ID: ${userItem.userId}`">
                        <span class="text-body font-bold text-[var(--text-primary)] truncate">{{ userItem.userName }}</span>
                        <!--
                          El correo sustituye al ID cuando llega: identifica
                          mejor a una persona. El ID queda en el title, que es
                          donde hace falta para soporte.
                        -->
                        <span v-if="correoDe(userItem)" class="text-caption text-[var(--text-secondary)] truncate">
                          {{ correoDe(userItem) }}
                        </span>
                        <span v-else class="text-caption font-mono text-[var(--text-muted)] tracking-tighter truncate">
                          {{ userItem.userId }}
                        </span>
                      </div>
                    </td>
                    <td class="px-lg py-md">
                      <span class="inline-block text-caption font-black px-md py-xs rounded-base border border-[var(--border-color)] tracking-[0.14em] uppercase" :style="{ color: userItem.planDescription?.includes('ADMIN') ? 'var(--accent-color)' : 'var(--text-secondary)' }">
                        {{ userItem.planDescription || 'SIN PLAN' }}
                      </span>
                    </td>
                    <td class="px-lg py-md">
                      <div class="flex items-center gap-md">
                        <div class="flex flex-col min-w-[60px]">
                            <span
                              class="text-body font-black tabular-nums"
                              :style="{ color: userItem.consumoDesconocido ? 'var(--text-secondary)' : (!sinTope(userItem.limite) && (userItem.number_requests ?? 0) >= userItem.limite ? '#ef4444' : 'var(--text-primary)') }"
                              :title="userItem.consumoDesconocido ? 'No se pudo leer el consumo de este usuario' : ''"
                            >
                            {{ userItem.consumoDesconocido ? '—' : (userItem.number_requests ?? 0) }}
                            </span>
                            <span class="text-caption font-bold text-[var(--text-muted)] tracking-[0.14em]">{{ userItem.consumoDesconocido ? 'SIN DATO' : (sinTope(userItem.limite) ? 'SIN LÍMITE' : `/ ${userItem.limite}`) }}</span>
                        </div>
                        <div v-if="!sinTope(userItem.limite) && !userItem.consumoDesconocido" class="hidden sm:block flex-1 h-1 bg-black/20 rounded-full overflow-hidden max-w-[80px]">
                            <div class="h-full bg-[var(--accent-color)] text-[var(--text-secondary)]" :style="{ width: Math.min(((userItem.number_requests ?? 0) / userItem.limite * 100), 100) + '%' }"></div>
                        </div>
                      </div>
                    </td>
                    <td class="px-lg py-md">
                      <span v-if="userItem.registro" class="text-caption text-[var(--text-secondary)] tabular-nums" :title="userItem.registro">
                        {{ fechaCorta(userItem.registro) }}
                      </span>
                      <span v-else class="text-caption text-[var(--text-muted)]">—</span>
                    </td>
                    <td class="px-lg py-md text-right">
                      <div class="flex justify-end gap-sm">
                        <button 
                          @click="openEditModal(userItem)"
                          class="px-md py-sm rounded-base text-caption font-black tracking-[0.14em] border border-[var(--border-color)] hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] transition-all uppercase"
                        >
                          Editar
                        </button>
                        <button 
                          @click="resetRequests(userItem)"
                          :disabled="userItem.number_requests === 0 || isResetting === userItem.userId"
                          class="px-md py-sm rounded-base text-caption font-black tracking-[0.14em] border border-red-500/20 text-red-500/60 hover:text-red-500 hover:border-red-500/50 transition-all uppercase disabled:text-[var(--text-muted)]"
                        >
                          <span v-if="isResetting === userItem.userId">...</span>
                          <span v-else>Reset</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div v-if="usuariosVisibles.length < usuariosFiltrados.length" class="flex items-center justify-center gap-md py-lg">
                <p class="text-overline uppercase tracking-[0.14em] text-[var(--text-muted)]">
                  {{ usuariosVisibles.length }} de {{ usuariosFiltrados.length }}
                </p>
                <button type="button" class="btn-secondary" @click="visibles += PASO_FILAS">
                  Mostrar {{ Math.min(PASO_FILAS, usuariosFiltrados.length - usuariosVisibles.length) }} más
                </button>
              </div>
            </div>
            </template>

            <!-- ══ Planes ══ -->
            <template v-else>
              <div class="p-lg space-y-md">
                <div class="flex items-center justify-between gap-md">
                  <p class="text-overline uppercase tracking-[0.14em] text-[var(--text-muted)]">
                    {{ planes.length }} {{ planes.length === 1 ? 'plan' : 'planes' }}
                  </p>
                  <button type="button" class="btn-primary" @click="abrirPlan(null)">Crear plan</button>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
                  <div v-for="pl in planes" :key="pl.id" class="glass-card p-lg space-y-md">
                    <div>
                      <p class="text-body font-semibold">{{ pl.description }}</p>
                      <p class="text-overline uppercase tracking-[0.14em] text-[var(--text-muted)] mt-xs">
                        {{ pl.daily_limit != null ? `${pl.daily_limit} consultas al día` : 'Sin cupo definido' }}
                      </p>
                    </div>

                    <div class="flex items-center justify-between gap-md">
                      <span class="text-overline uppercase tracking-[0.14em] text-[var(--text-muted)]">
                        {{ usuariosPorPlan[pl.description] ?? 0 }} usuarios
                      </span>
                      <button type="button" class="btn-secondary" @click="abrirPlan(pl)">Editar</button>
                    </div>
                  </div>
                </div>

                <div v-if="errorPlanes" class="rounded-base border border-amber-500/20 bg-amber-500/5 px-md py-md space-y-sm">
                  <p class="text-caption leading-relaxed text-amber-500">{{ errorPlanes }}</p>
                  <button type="button" class="btn-secondary" @click="fetchPlanes" :disabled="cargandoPlanes">
                    {{ cargandoPlanes ? 'Reintentando…' : 'Reintentar' }}
                  </button>
                </div>
              </div>
            </template>
          </div>
      </div>

      <!-- Footer en Admin -->
      <MainFooter />

      <!-- Alta y edicion de planes -->
      <transition
        enter-active-class="duration-base ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100"
        leave-active-class="duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0"
      >
        <div v-if="planEditando !== null" class="fixed inset-0 z-[100] flex items-center justify-center p-lg bg-black/60 backdrop-blur-md" @click.self="cerrarPlan">
          <div class="w-full max-w-md glass-card p-xl animate-fade-in shadow-2xl">
            <p class="text-overline font-black tracking-[0.14em] uppercase text-[var(--text-muted)] mb-xs">
              {{ planEditando?.id ? 'Editar plan' : 'Nuevo plan' }}
            </p>
            <h3 class="text-h4 font-light tracking-tight mb-lg">
              {{ planEditando?.id ? planEditando.description : 'Crear un plan' }}
            </h3>

            <form @submit.prevent="guardarPlan" class="space-y-lg">
              <!--
                Etiquetas fijas, no el patron flotante: aqui conviven un texto y
                un numero, y mantenerlos identicos evita que uno se descuadre.
              -->
              <div class="space-y-sm">
                <label for="plan_desc" class="!static !translate-y-0 !scale-100 block text-overline font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                  Nombre del plan
                </label>
                <input
                  id="plan_desc" v-model="planForm.description" type="text" maxlength="100" required
                  class="w-full min-h-[48px] bg-transparent border-b border-[var(--border-color)] py-sm outline-none font-body text-body text-[var(--text-primary)] transition-colors focus:border-[var(--accent-color)]"
                />
                <p class="text-overline text-[var(--text-muted)]">{{ planForm.description.length }} de 100 caracteres</p>
              </div>

              <div class="space-y-sm">
                <label for="plan_limit" class="!static !translate-y-0 !scale-100 block text-overline font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                  Consultas al día
                </label>
                <input
                  id="plan_limit" v-model.number="planForm.daily_limit" type="number" min="0" step="1" required
                  class="w-full min-h-[48px] bg-transparent border-b border-[var(--border-color)] py-sm outline-none font-body text-body text-[var(--text-primary)] transition-colors focus:border-[var(--accent-color)]"
                />
                <p class="text-overline text-[var(--text-muted)]">Cero deja el plan sin consultas disponibles.</p>
              </div>

              <p
                v-if="planEditando?.id && (usuariosPorPlan[planEditando.description] ?? 0) > 0"
                class="rounded-base border border-amber-500/20 bg-amber-500/5 px-md py-md text-caption leading-relaxed text-amber-500"
              >
                Este plan lo usan {{ usuariosPorPlan[planEditando.description] }} usuarios. El cambio les afecta a todos.
              </p>

              <p v-if="errorPlan" class="rounded-base border border-red-500/20 bg-red-500/5 px-md py-md text-caption leading-relaxed text-red-400">
                {{ errorPlan }}
              </p>

              <div class="flex gap-md pt-sm">
                <button type="button" class="flex-1 btn-secondary" @click="cerrarPlan">Cancelar</button>
                <button type="submit" class="flex-1 btn-primary" :disabled="guardandoPlan">
                  {{ guardandoPlan ? 'Guardando…' : (planEditando?.id ? 'Guardar cambios' : 'Crear plan') }}
                </button>
              </div>
            </form>

            <!--
              Eliminar va aparte del formulario y en dos pasos: es la unica
              accion irreversible de la pantalla. Solo se ofrece si el plan no
              tiene usuarios, que es ademas lo que el backend exige.
            -->
            <div v-if="planEditando?.id" class="mt-lg pt-lg border-t border-[var(--border-color)]">
              <template v-if="(usuariosPorPlan[planEditando.description] ?? 0) > 0">
                <p class="text-caption leading-relaxed text-[var(--text-muted)]">
                  Para eliminar este plan, antes hay que mover sus
                  {{ usuariosPorPlan[planEditando.description] }} usuarios a otro.
                </p>
              </template>

              <template v-else-if="!confirmandoBorrado">
                <button
                  type="button"
                  class="text-caption font-bold tracking-[0.14em] uppercase transition-colors"
                  style="color: var(--estado-error);"
                  @click="confirmandoBorrado = true"
                >
                  Eliminar plan
                </button>
              </template>

              <template v-else>
                <p class="text-caption leading-relaxed mb-md" style="color: var(--estado-error);">
                  Se eliminará «{{ planEditando.description }}» de forma permanente.
                </p>
                <div class="flex gap-md">
                  <button type="button" class="flex-1 btn-secondary" @click="confirmandoBorrado = false">
                    Conservar
                  </button>
                  <button
                    type="button"
                    class="flex-1 btn-base border"
                    style="color: var(--estado-error); border-color: var(--estado-error);"
                    :disabled="borrandoPlan"
                    @click="borrarPlan"
                  >
                    {{ borrandoPlan ? 'Eliminando…' : 'Sí, eliminar' }}
                  </button>
                </div>
              </template>
            </div>
          </div>
        </div>
      </transition>

      <!-- Edit Modal -->
      <transition 
        enter-active-class="duration-base ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100"
        leave-active-class="duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0"
      >
        <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-lg bg-black/60 backdrop-blur-md">
          <div class="w-full max-w-md glass-card p-xl relative animate-fade-in shadow-2xl">
            <h3 class="text-lead font-bold tracking-tight mb-xl flex items-center gap-md">
                <span class="w-2 h-8 bg-[var(--accent-color)] rounded-full"></span>
                EDITAR USUARIO
            </h3>
            
            <form @submit.prevent="saveUserChanges" class="space-y-xl">
              <div class="relative group input-container">
                <input v-model="editForm.userName" type="text" id="edit_username" placeholder=" " class="custom-input peer" required />
                <label for="edit_username">Nombre de Usuario (Ej: Juan_12)</label>
              </div>

              <!--
                Selector propio en vez de <select>: el desplegable nativo lo
                pinta el sistema operativo y no hay forma de que case con el
                resto de la interfaz. Reutiliza el lenguaje de ProfileDropdown.
              -->
              <div class="space-y-sm">
                <p class="text-caption font-black text-[var(--text-muted)] uppercase tracking-[0.14em]">Plan asignado</p>

                <div class="relative">
                  <button
                    type="button"
                    @click="planAbierto = !planAbierto"
                    class="w-full flex items-center justify-between gap-md glass-panel py-md px-md rounded-base hover:bg-white/5 transition-all active:scale-[0.99] text-left"
                  >
                    <span class="flex flex-col min-w-0">
                      <span
                        class="text-body font-bold tracking-[0.14em] uppercase truncate"
                        :class="planSeleccionado ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'"
                      >
                        {{ planSeleccionado?.description || 'Selecciona un plan' }}
                      </span>
                      <span v-if="planSeleccionado" class="text-caption font-black tracking-[0.14em] text-[var(--text-muted)] uppercase">
                        {{ planSeleccionado.daily_limit ? `${planSeleccionado.daily_limit} consultas/día` : 'Sin límite' }}
                      </span>
                    </span>
                    <svg
                      class="w-4 h-4 shrink-0 text-[var(--text-secondary)] transition-transform duration-base"
                      :class="planAbierto ? 'rotate-180 text-[var(--accent-color)]' : ''"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  <!-- Captura los clics fuera para cerrar el panel -->
                  <div v-if="planAbierto" class="fixed inset-0 z-[105]" @click="planAbierto = false"></div>

                  <transition
                    enter-active-class="transition duration-200 ease-out"
                    enter-from-class="transform scale-95 opacity-0 -translate-y-1"
                    enter-to-class="transform scale-100 opacity-100 translate-y-0"
                    leave-active-class="transition duration-150 ease-in"
                    leave-from-class="transform scale-100 opacity-100 translate-y-0"
                    leave-to-class="transform scale-95 opacity-0 -translate-y-1"
                  >
                    <div
                      v-if="planAbierto"
                      class="absolute left-0 right-0 top-full mt-sm z-[110] p-sm rounded-base border shadow-2xl bg-[var(--surface-color)] border-[var(--border-color)] max-h-56 overflow-y-auto custom-scrollbar"
                    >
                      <button
                        v-for="pl in planes"
                        :key="pl.id"
                        type="button"
                        @click="elegirPlan(pl)"
                        class="w-full flex items-center justify-between gap-md px-md py-md rounded-base hover:bg-[var(--accent-color)]/10 hover:text-[var(--accent-color)] transition-all text-left"
                        :class="pl.id === editForm.plan ? 'bg-[var(--accent-color)]/10 text-[var(--accent-color)]' : ''"
                      >
                        <span class="text-caption font-bold uppercase tracking-wider truncate">{{ pl.description }}</span>
                        <span class="text-caption font-black tracking-[0.14em] text-[var(--text-muted)] shrink-0">
                          {{ pl.daily_limit ? `${pl.daily_limit}/día` : 'SIN TOPE' }}
                        </span>
                      </button>

                      <p v-if="!planes.length" class="px-md py-md text-caption tracking-wide text-amber-500">
                        {{ errorPlanes || 'No se pudo cargar el catálogo de planes.' }}
                      </p>
                    </div>
                  </transition>
                </div>
              </div>

              <div class="relative group input-container">
                <input v-model="editForm.number_requests" type="number" id="edit_requests" placeholder=" " class="custom-input peer" required min="0" />
                <label for="edit_requests">Peticiones consumidas</label>
                <p class="text-overline text-[var(--text-muted)] mt-xs leading-relaxed">
                  Número de consultas del usuario. Ponerlo a cero le devuelve el cupo.
                </p>
              </div>

              <p
                v-if="modalError"
                class="rounded-base border border-red-500/20 bg-red-500/5 px-md py-md text-caption leading-relaxed tracking-wide text-red-400"
              >
                {{ modalError }}
              </p>

              <div class="flex gap-md pt-md">
                <button 
                  type="button" 
                  @click="showModal = false"
                  class="flex-1 py-md rounded-base text-caption font-black tracking-[0.14em] border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-white/5 transition-all uppercase"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  class="flex-1 py-md btn-primary text-caption font-black tracking-[0.14em] uppercase"
                  :disabled="isSaving"
                >
                  {{ isSaving ? 'Guardando...' : 'Confirmar Cambios' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </transition>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import BrandMark from '../ui/components/BrandMark.vue';
import SecuritySeals from '../ui/components/SecuritySeals.vue';
import { useAuth } from '../composables/useAuth';
import { authService } from '../api/authService';
import MainFooter from '../ui/components/MainFooter.vue';

const router = useRouter();
const { logout, userName, isAdmin } = useAuth();

const isSidebarOpen = ref(false);
const users = ref<any[]>([]);
const isLoading = ref(false);
const showModal = ref(false);
const modalError = ref('');
const planes = ref<any[]>([]);

/* ─── Gestion de planes ───────────────────────────────────────
   Hasta ahora el catalogo solo servia para el desplegable del modal
   de usuario. Con el CRUD publicado se puede administrar desde aqui
   en vez de entrar a PocketBase.
   ───────────────────────────────────────────────────────────── */
const pestana = ref<'usuarios' | 'planes'>('usuarios');
const pestanas = [
  { valor: 'usuarios' as const, texto: 'Usuarios' },
  { valor: 'planes' as const, texto: 'Planes' }
];
const planEditando = ref<any | null>(null);
const planForm = reactive({ description: '', daily_limit: 0 });
const guardandoPlan = ref(false);
const errorPlan = ref('');

const abrirPlan = (pl: any | null) => {
  planEditando.value = pl;
  planForm.description = pl?.description ?? '';
  planForm.daily_limit = pl?.daily_limit ?? 0;
  errorPlan.value = '';
};

const confirmandoBorrado = ref(false);
const borrandoPlan = ref(false);

const cerrarPlan = () => {
  planEditando.value = null;
  errorPlan.value = '';
  confirmandoBorrado.value = false;
};

/**
 * Borrado en dos pasos, sin confirm() del navegador: el aviso vive en el
 * propio modal y dice cuantos usuarios lo usan antes de decidir.
 */
const borrarPlan = async () => {
  if (!planEditando.value?.id) return;

  borrandoPlan.value = true;
  errorPlan.value = '';
  try {
    await authService.deletePlan(planEditando.value.id);
    await fetchPlanes();
    cerrarPlan();
  } catch (error: any) {
    // 409 es el caso previsto: el plan sigue en uso.
    errorPlan.value = error?.response?.status === 409
      ? 'No se puede eliminar: el plan todavía tiene usuarios asignados. Muévelos a otro plan primero.'
      : (error?.message || 'No se pudo eliminar el plan.');
    confirmandoBorrado.value = false;
    console.error('[admin] fallo al eliminar el plan:', {
      status: error?.response?.status, body: error?.response?.data
    });
  } finally {
    borrandoPlan.value = false;
  }
};

const guardarPlan = async () => {
  const descripcion = planForm.description.trim();
  if (!descripcion) { errorPlan.value = 'La descripción no puede quedar vacía.'; return; }
  if (descripcion.length > 100) { errorPlan.value = 'La descripción admite como máximo 100 caracteres.'; return; }
  if (!Number.isInteger(planForm.daily_limit) || planForm.daily_limit < 0) {
    errorPlan.value = 'El cupo diario debe ser un entero igual o mayor que cero.';
    return;
  }

  guardandoPlan.value = true;
  errorPlan.value = '';
  try {
    // planEditando con id es edicion; sin el, alta.
    if (planEditando.value?.id) {
      await authService.updatePlan(planEditando.value.id, {
        description: descripcion,
        daily_limit: planForm.daily_limit
      });
    } else {
      await authService.createPlan({ description: descripcion, daily_limit: planForm.daily_limit });
    }
    await fetchPlanes();
    cerrarPlan();
  } catch (error: any) {
    errorPlan.value = error?.message || 'No se pudo guardar el plan.';
    console.error('[admin] fallo al guardar el plan:', {
      status: error?.response?.status, body: error?.response?.data
    });
  } finally {
    guardandoPlan.value = false;
  }
};

/** Cuantos usuarios tiene asignado cada plan, para avisar antes de tocarlo. */
const usuariosPorPlan = computed(() => {
  const cuenta: Record<string, number> = {};
  for (const u of users.value) {
    const d = u.planDescription;
    if (d) cuenta[d] = (cuenta[d] ?? 0) + 1;
  }
  return cuenta;
});
const planAbierto = ref(false);

const planSeleccionado = computed(() =>
  planes.value.find((pl: any) => pl.id === editForm.plan) || null
);

const elegirPlan = (pl: any) => {
  editForm.plan = pl.id;
  planAbierto.value = false;
};
const isSaving = ref(false);
const isResetting = ref<string | null>(null);
const loadError = ref('');

/* ─── Filtros de la tabla ─────────────────────────────────────
   Se aplican en el cliente: el listado ya viene entero en una sola
   peticion, asi que filtrar en servidor no ahorraria nada.
   ───────────────────────────────────────────────────────────── */
const buscaUsuario = ref('');
/** Copia con retardo: evita recalcular y repintar en cada tecla. */
const buscaAplicada = ref('');
let temporizadorBusca: ReturnType<typeof setTimeout> | undefined;

/** Cuantas filas se pintan. Con miles de usuarios, pintarlas todas cuesta. */
const PASO_FILAS = 100;
const visibles = ref(PASO_FILAS);
const filtroPlan = ref('');
const minPeticiones = ref<number | null>(null);
const orden = ref<'nombre' | 'mas' | 'menos' | 'nuevos' | 'antiguos'>('nombre');
const desde = ref('');
const hasta = ref('');

/** Fecha legible; PocketBase entrega ISO o "YYYY-MM-DD HH:mm:ss.SSSZ". */
const fechaCorta = (v: string) => {
  const d = new Date(String(v).replace(' ', 'T'));
  return Number.isNaN(d.getTime())
    ? '—'
    : d.toLocaleDateString('es-EC', { day: '2-digit', month: 'short', year: 'numeric' });
};

/** Solo la parte de fecha, para comparar contra los input type=date. */
const soloFecha = (v: any) => {
  const d = new Date(String(v ?? '').replace(' ', 'T'));
  return Number.isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
};

/**
 * Los cuatro campos comparten plantilla: asi es imposible que uno acabe con
 * distinto alto, borde o interlineado que los demas.
 */
const campos = [
  { id: 'f_busca', etiqueta: 'Usuario, correo o ID', tipo: 'search', min: undefined,
    valor: buscaUsuario, actualiza: (v: string) => { buscaUsuario.value = v; } },
  { id: 'f_min', etiqueta: 'Peticiones desde', tipo: 'number', min: '0',
    valor: minPeticiones, actualiza: (v: string) => { minPeticiones.value = v === '' ? null : Number(v); } },
  { id: 'f_desde', etiqueta: 'Registrado desde', tipo: 'date', min: undefined,
    valor: desde, actualiza: (v: string) => { desde.value = v; } },
  { id: 'f_hasta', etiqueta: 'Registrado hasta', tipo: 'date', min: undefined,
    valor: hasta, actualiza: (v: string) => { hasta.value = v; } }
];

const ordenes = [
  { valor: 'nombre' as const, texto: 'A-Z' },
  { valor: 'mas' as const, texto: 'Más peticiones' },
  { valor: 'menos' as const, texto: 'Menos peticiones' },
  { valor: 'nuevos' as const, texto: 'Más recientes' },
  { valor: 'antiguos' as const, texto: 'Más antiguos' }
];

/**
 * Correo del usuario, buscando la clave por patron.
 *
 * El esquema publicado no lo declara, y ya paso con create_at que el nombre
 * real no era el esperado. En vez de fijar una clave se busca cualquiera que
 * contenga mail o correo, asi da igual como se llame.
 */
const correoDe = (u: any): string => {
  if (!u) return '';
  const clave = Object.keys(u).find(k => /mail|correo/i.test(k));
  return clave ? String(u[clave] ?? '').trim() : '';
};

const normaliza = (t: any) => String(t ?? '')
  .toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();

/** Planes presentes en el listado, para ofrecer solo los que existen. */
const planesEnUso = computed(() => {
  const vistos = new Set<string>();
  for (const u of users.value) if (u.planDescription) vistos.add(u.planDescription);
  return [...vistos].sort();
});

const usuariosFiltrados = computed(() => {
  let lista = [...users.value];

  const q = normaliza(buscaAplicada.value);
  if (q) {
    lista = lista.filter(u =>
      normaliza(u.userName).includes(q) ||
      normaliza(correoDe(u)).includes(q) ||
      normaliza(u.userId).includes(q)
    );
  }

  if (filtroPlan.value) {
    lista = lista.filter(u => u.planDescription === filtroPlan.value);
  }

  if (minPeticiones.value !== null && minPeticiones.value >= 0) {
    lista = lista.filter(u => (u.number_requests ?? 0) >= minPeticiones.value!);
  }

  if (desde.value) {
    lista = lista.filter(u => u.registro && soloFecha(u.registro) >= desde.value);
  }
  if (hasta.value) {
    lista = lista.filter(u => u.registro && soloFecha(u.registro) <= hasta.value);
  }

  if (orden.value === 'nuevos' || orden.value === 'antiguos') {
    const signo = orden.value === 'nuevos' ? -1 : 1;
    lista.sort((a, b) => signo * (soloFecha(a.registro).localeCompare(soloFecha(b.registro))));
  } else if (orden.value === 'mas') {
    lista.sort((a, b) => (b.number_requests ?? 0) - (a.number_requests ?? 0));
  } else if (orden.value === 'menos') {
    lista.sort((a, b) => (a.number_requests ?? 0) - (b.number_requests ?? 0));
  } else {
    lista.sort((a, b) => normaliza(a.userName).localeCompare(normaliza(b.userName)));
  }

  return lista;
});

/** La lista que de verdad llega al DOM. */
const usuariosVisibles = computed(() => usuariosFiltrados.value.slice(0, visibles.value));

/** Cualquier cambio de filtro vuelve al primer tramo. */
watch([buscaAplicada, filtroPlan, minPeticiones, desde, hasta, orden], () => {
  visibles.value = PASO_FILAS;
});

watch(buscaUsuario, (v) => {
  clearTimeout(temporizadorBusca);
  temporizadorBusca = setTimeout(() => { buscaAplicada.value = v; }, 200);
});

const hayFiltros = computed(() =>
  !!buscaUsuario.value || !!filtroPlan.value || minPeticiones.value !== null
  || !!desde.value || !!hasta.value
);

const limpiarFiltros = () => {
  buscaUsuario.value = '';
  buscaAplicada.value = '';
  filtroPlan.value = '';
  minPeticiones.value = null;
  desde.value = '';
  hasta.value = '';
};

// Los planes sin tope usan un limite centinela enorme; pintarlo literal daba
// "9 / 9999999999" con la barra al 0,00000009 %.
const LIMITE_SIN_TOPE = 1_000_000;
const sinTope = (limite?: number) => (limite ?? 0) >= LIMITE_SIN_TOPE;


const editForm = reactive({
  userId: '',
  userName: '',
  plan: '',
  number_requests: 0
});

onMounted(() => {
  if (!isAdmin.value) {
    router.push('/dashboard');
    return;
  }
  fetchUsers();
  fetchPlanes();
});

/**
 * Catalogo de planes para el desplegable de edicion.
 *
 * El listado de usuarios solo trae `planDescription`, no el id del plan, asi
 * que hace falta el catalogo para saber que valor enviar en el PATCH.
 */
const errorPlanes = ref('');
const cargandoPlanes = ref(false);

const fetchPlanes = async () => {
  cargandoPlanes.value = true;
  errorPlanes.value = '';
  try {
    const data = await authService.getPlans();

    // La respuesta puede venir paginada o como lista suelta: se aceptan ambas
    // en vez de dar por hecho una forma que no esta garantizada.
    const items = Array.isArray(data) ? data : (data?.items ?? []);
    planes.value = items;

    if (items.length === 0) {
      // Se describe la respuesta recibida para poder distinguir una coleccion
      // vacia de un listado que llega en otra clave.
      const claves = data && typeof data === 'object' ? Object.keys(data) : [];
      const total = (data as any)?.totalItems;
      errorPlanes.value =
        `El servidor respondió sin planes en "items". Devolvió: ${claves.length ? claves.join(', ') : typeof data}`
        + (total !== undefined ? ` · totalItems: ${total}` : '');
    }
    console.info('[admin] respuesta de /api/plan/get/:', data);
  } catch (error: any) {
    planes.value = [];
    // El interceptor ya deja en message un texto presentable.
    errorPlanes.value = `${error?.message || 'No se pudo cargar el catálogo de planes.'}`
      + (error?.response?.status ? ` (HTTP ${error.response.status})` : '');
    console.error('[admin] fallo al cargar planes:', {
      status: error?.response?.status, body: error?.response?.data
    });
  } finally {
    cargandoPlanes.value = false;
  }
};

const fetchUsers = async () => {
  isLoading.value = true;
  loadError.value = '';
  try {
    const data = await authService.getAllUsersPlans();

    // El listado ya trae la cuota de cada usuario, asi que basta una peticion.
    // Antes habia que pedir el consumo uno a uno contra users/get/: 36 llamadas
    // para 35 usuarios, con fallos por limite por IP y por permisos.
    // Traza de diagnostico: que campos devuelve realmente el backend, que no
    // siempre coincide con lo que declara el esquema publicado.
    if (data.items?.[0]) {
      console.info('[admin] campos recibidos por usuario:', Object.keys(data.items[0]));
    }

    users.value = (data.items || []).map((u: any) => ({
      ...u,
      // El contador que manda es number_requests, que es el que el backend
      // valida y reinicia. Si el listado todavia no lo incluye se cae a
      // quota.used para no dejar la columna vacia.
      number_requests: u.number_requests ?? u.quota?.used ?? 0,
      // La fila avisa si el dato viene del respaldo y no del campo real.
      consumoDeRespaldo: u.number_requests === undefined,
      // daily_limit es el cupo del plan tal cual; quota.limit y token_duration
      // quedan de respaldo por si alguna fila viniera sin el.
      limite: u.daily_limit ?? u.quota?.limit ?? u.token_duration,
      registro: u.create_at ?? null,
      // quota es nullable: si no viene, no inventamos un cero.
      consumoDesconocido: !u.quota
    }));

    // Ya se recorren todas las paginas; solo se avisa si el tope de seguridad
    // dejo alguna fuera.
    if (data.paginasOmitidas > 0) {
      loadError.value = `Mostrando ${users.value.length} de ${data.totalItems} usuarios: quedaron ${data.paginasOmitidas} páginas sin cargar.`;
    }
  } catch (error: any) {
    // Se avisa de forma explícita en vez de mostrar una tabla vacía, que
    // se leería como "no hay usuarios".
    users.value = [];
    loadError.value = error?.message || 'No se pudo cargar el listado de usuarios.';
    console.error('Error fetching users:', error);
  } finally {
    isLoading.value = false;
  }
};

const handleLogout = () => {
  logout();
  router.push('/auth');
};

const openEditModal = (userItem: any) => {
  editForm.userId = userItem.userId;
  editForm.userName = userItem.userName;
  // OJO: userItem.id es el id de la fila de plan_users, NO el del plan. Enviarlo
  // como `plan` hacia que el backend rechazara el PATCH con invalid_input. Se
  // resuelve el plan real casando la descripcion contra el catalogo.
  editForm.plan = planes.value.find(
    (pl: any) => pl.description === userItem.planDescription
  )?.id || '';
  // El consumo viene en el listado; ya no hace falta una peticion por usuario.
  editForm.number_requests = userItem.number_requests ?? 0;
  modalError.value = '';
  planAbierto.value = false;
  showModal.value = true;
};

const resetRequests = async (userItem: any) => {
  if (!confirm(`¿Reiniciar peticiones para ${userItem.userName}?`)) return;
  isResetting.value = userItem.userId;
  try {
    await authService.patchUser(userItem.userId, { number_requests: 0 });
    const idx = users.value.findIndex(u => u.userId === userItem.userId);
    if (idx !== -1) {
      // Tras reiniciar, el consumo pasa a ser conocido: cero de verdad.
      users.value[idx] = { ...users.value[idx], number_requests: 0, consumoDesconocido: false };
    }
  } catch (error) {
    console.error('Error al resetear peticiones:', error);
  } finally {
    isResetting.value = null;
  }
};

const saveUserChanges = async () => {
  if (!editForm.plan) {
    // El selector propio no participa en la validacion nativa del formulario.
    modalError.value = 'Selecciona un plan antes de guardar.';
    return;
  }

  isSaving.value = true;
  modalError.value = '';
  try {
    // Un unico PATCH con todos los campos. Antes eran dos llamadas seguidas al
    // mismo endpoint, asi que si la segunda fallaba el usuario quedaba a medio
    // actualizar sin que nadie se enterase.
    await authService.updateUser(editForm.userId, {
      username: editForm.userName,
      number_requests: Number(editForm.number_requests),
      plan: editForm.plan
    });

    showModal.value = false;

    // Se espera de verdad al refresco: antes se lanzaba sin await, asi que el
    // modal se cerraba y no habia forma de saber si el listado llegaba a
    // actualizarse ni si fallaba.
    await fetchUsers();

    // El listado y el registro de usuario son colecciones distintas. Si tras
    // recargar sigue apareciendo el valor anterior, el dato se guardo pero el
    // listado no lo refleja: se avisa en vez de dejar una pantalla que
    // contradice a la base.
    const fila = users.value.find((u: any) => u.userId === editForm.userId);
    if (fila && fila.userName !== editForm.userName) {
      console.warn('[admin] el listado no refleja el cambio recien guardado', {
        userId: editForm.userId,
        enviado: editForm.userName,
        devuelto: fila.userName
      });
      loadError.value = 'El cambio se guardó correctamente, pero el listado sigue devolviendo los datos anteriores. Vuelve a cargar en unos segundos.';
    }
  } catch (error: any) {
    // El interceptor ya deja en `message` un texto presentable y, cuando el
    // backend rechaza campos concretos, la lista en `invalidFields`.
    const campos = error?.invalidFields?.length
      ? ` Campos rechazados: ${error.invalidFields.join(', ')}.`
      : '';
    modalError.value = `${error?.message || 'No se pudo actualizar el usuario.'}${campos}`;
    console.error('[admin] fallo al actualizar usuario:', {
      userId: editForm.userId,
      status: error?.response?.status,
      body: error?.response?.data
    });
  } finally {
    isSaving.value = false;
  }
};
</script>

<style scoped>
.noise-overlay {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E");
}
</style>
