import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { UserIcon, LockClosedIcon, FireIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../contexts/AuthContext';

const schema = yup.object({
  username: yup.string().required('El usuario es requerido'),
  password: yup.string().required('La contraseña es requerida')
});

const yupResolver = (validationSchema) => async (data) => {
  try {
    const values = await validationSchema.validate(data, { abortEarly: false });
    return { values, errors: {} };
  } catch (err) {
    const formErrors = err.inner.reduce((acc, cur) => {
      acc[cur.path] = { type: cur.type || 'validation', message: cur.message };
      return acc;
    }, {});
    return { values: {}, errors: formErrors };
  }
};

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      await login(data);
      navigate('/');
    } catch {
      // errors handled by interceptor
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm space-y-6 rounded-lg bg-white p-8 shadow"
      >
        <div className="text-center">
          <FireIcon className="mx-auto h-12 w-12 text-chapina-red" />
          <h1 className="mt-2 text-2xl font-bold text-chapina-red">CazuelaChapina</h1>
        </div>

        <div className="space-y-2">
          <label htmlFor="username" className="block text-sm font-medium">
            Usuario
          </label>
          <div className="relative">
            <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              id="username"
              type="text"
              {...register('username')}
              className="w-full rounded border px-10 py-2 focus:outline-none focus:ring-2 focus:ring-chapina-red"
            />
          </div>
          {errors.username && (
            <p className="text-sm text-red-600">{errors.username.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium">
            Contraseña
          </label>
          <div className="relative">
            <LockClosedIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              id="password"
              type="password"
              {...register('password')}
              className="w-full rounded border px-10 py-2 focus:outline-none focus:ring-2 focus:ring-chapina-red"
            />
          </div>
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded bg-chapina-red py-2 text-white hover:bg-chapina-red/90 disabled:opacity-50"
        >
          {isSubmitting ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
};

export default Login;

