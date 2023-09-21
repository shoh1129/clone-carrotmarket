import { useForm, FieldErrors } from "react-hook-form"

// less code
// better validation
// better Errors
// have control over inputs
// dont deal with event
// Easier Inputs

interface LoginForm {
  username: string;
  password: string;
  email: string;
  errors?: string;
}

export default function Forms() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset
  } = useForm<LoginForm>({
    mode: 'onBlur'
  });
  
  const onValid = (data: LoginForm) => {
    console.log('im valid by');
    setError('errors', { message: 'backend is offline sorry.' })
  }

  const onInValid = (errors: FieldErrors) => {
    // console.log(errors)
  }

  const onClickReset = () => {
    reset();
  }

  console.log(errors)

  return (
    <form onSubmit={handleSubmit(onValid, onInValid)}>
      <input
        {...register('username', {
          required: {
            value: true,
            message: 'Username is required',
          },
          minLength: {
            value:5 ,
            message: 'The username should be longer than 5 chars.'
          },
        })}
        type="text"
        placeholder="Username"
      />
      {errors.username?.message}
      <input
        {...register('email', {
          required: 'Email is required',
          validate: {
            notGmail: (value) => !value.includes('@gmail.com') || 'not gmail!'
          }
        })}
        type="email"
        placeholder="Email"
        className={`${Boolean(errors.email?.message) && 'border-red-400'}`}
      />
      {errors.email?.message}
      <input
        {...register('password', {
          required: 'Password is required',
        })}
        type="password"
        placeholder="Pasword"
      />
      {errors.password?.message}

      <button onClick={onClickReset}>reset</button>

      <input type="submit" value="Create Account" />
      {errors.errors?.message}
    </form>
  )
}