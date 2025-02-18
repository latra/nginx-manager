interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  ...props 
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center rounded-md font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
  
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600',
    secondary: 'bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50',
    danger: 'bg-red-600 text-white hover:bg-red-500 focus-visible:outline-red-600'
  }

  const sizes = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-2 text-base'
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function Card({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg p-6 ${className}`}>
      {children}
    </div>
  )
}

export function Input({
  label,
  error,
  className = '',
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label?: string, error?: string }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">
          {label}
        </label>
      )}
      <input
        className={`
          block w-full rounded-md border-0 
          py-2.5 px-4
          text-gray-900 shadow-sm 
          ring-1 ring-inset ring-gray-300 
          placeholder:text-gray-400 
          focus:ring-2 focus:ring-inset focus:ring-indigo-600 
          sm:text-sm sm:leading-6
          ${error ? 'ring-red-300 focus:ring-red-500' : ''} 
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

export function Badge({ 
  children,
  variant = 'default'
}: { 
  children: React.ReactNode
  variant?: 'success' | 'error' | 'warning' | 'default'
}) {
  const variants = {
    success: 'bg-green-50 text-green-700 ring-green-600/20',
    error: 'bg-red-50 text-red-700 ring-red-600/20',
    warning: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20',
    default: 'bg-gray-50 text-gray-600 ring-gray-500/10',
  }

  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-sm font-medium ring-1 ring-inset ${variants[variant]}`}>
      {children}
    </span>
  )
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function Textarea({ label, className = '', ...props }: TextareaProps) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <textarea
        className={`
          block w-full rounded-md border-0 
          py-2.5 px-4
          text-gray-900 shadow-sm 
          ring-1 ring-inset ring-gray-300
          placeholder:text-gray-400 
          focus:ring-2 focus:ring-inset focus:ring-indigo-600 
          sm:text-sm sm:leading-6
          ${className}
        `}
        {...props}
      />
    </div>
  )
} 