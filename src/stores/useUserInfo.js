// stores/user.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore(
  'userInfo',()=>{
    const id= ref(0)
    const memberId=ref('')
    const email=ref('')
    const name=ref('')
    const birth=ref('')
    const gender=ref('')
    const signUpDate = ref('')
    const auth = ref([])
    const token=ref('')

    const setUserInfo = (getId,getMemberId,getEmail,getName,getBirth,getGender,getSignUpDate,getAuth,getToken)=>{
      id.value = getId
      memberId.value = getMemberId
      email.value = getEmail
      name.value = getName
      birth.value = getBirth
      gender.value = getGender
      signUpDate.value = getSignUpDate
      auth.value = getAuth
      token.value = getToken
    }

    const clearUserInfo = () => {
      id.value = 0
      token.value = ''
      memberId.value = ''
      email.value = ''
      name.value = ''
      birth.value = ''
      gender.value = ''
      signUpDate.value = ''
      auth.value = []
    }

    return {id,token,memberId,email,name,birth,gender,signUpDate,auth,setUserInfo,clearUserInfo}
  },
  {
    persist: {
      enabled: true, //storage 저장유무
      storage: sessionStorage
    }
  }
  )
