export default function FormPacienteEditarSkeleton() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <div className="h-8 bg-gray-200 rounded-md w-48 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded-md w-64 animate-pulse"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded-lg w-40 animate-pulse"></div>
        </div>
      </div>

      {/* Form Skeleton */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="space-y-8">
          {/* Información Personal */}
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <div className="h-6 bg-gray-200 rounded-md w-48 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded-md w-32 animate-pulse"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded-md w-16 mb-1 animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded-md w-20 mb-1 animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded-md w-12 mb-1 animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded-md w-20 mb-1 animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Información Médica */}
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <div className="h-6 bg-gray-200 rounded-md w-40 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded-md w-56 animate-pulse"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded-md w-32 mb-1 animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded-md w-12 mb-1 animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded-md w-20 mb-1 animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded-md w-32 mb-1 animate-pulse"></div>
              <div className="h-24 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <div className="h-12 bg-gray-200 rounded-lg w-24 animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
