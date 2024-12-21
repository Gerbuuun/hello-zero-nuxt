<script setup lang="ts">
const z = useZero()

const jwt = useCookie('jwt')
const toggleLogin = async () => {
  if (z.userID === 'anon') {
    await fetch('/api/login')
  }
  else {
    jwt.value = null
  }
  location.reload()
}

const users = useQuery(z.query.user)
const currentUser = computed(() => z.userID)
// const groups = useQuery(z.query.group.whereExists('memberships', q => q.where(q => q.cmp('userID', currentUser.value))).related('memberships'))

const orgs = useQuery(z.query
  .group
  .where(q => q.cmp('type', 'organization'))
  .whereExists('memberships', q => q.where(q => q.cmp('userID', currentUser.value))),
)
</script>

<template>
  <div>
    <button @click="toggleLogin">
      {{ jwt ? 'Logout' : 'Login' }}
    </button>
    <pre>{{ jwt ? currentUser : 'anon' }}</pre>
    <pre>{{ orgs }}</pre>
    <pre>{{ users }}</pre>
  </div>
</template>
