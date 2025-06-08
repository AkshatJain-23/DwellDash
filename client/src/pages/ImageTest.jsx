import ImageWithFallback from '../components/ImageWithFallback'

const ImageTest = () => {
  const testImages = [
    {
      name: "Unsplash Image 1",
      src: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&crop=center"
    },
    {
      name: "Unsplash Image 2", 
      src: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop&crop=center"
    },
    {
      name: "Invalid Image",
      src: "https://invalid-url.com/image.jpg"
    },
    {
      name: "Local Image (should fail)",
      src: "http://localhost:5000/uploads/nonexistent.jpg"
    },
    {
      name: "No Source",
      src: null
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Image Loading Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testImages.map((image, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-semibold mb-4">{image.name}</h3>
              <div className="h-48 mb-4">
                <ImageWithFallback
                  src={image.src}
                  alt={image.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <p className="text-sm text-gray-600 break-all">
                Source: {image.src || 'null'}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Console Output</h2>
          <p className="text-gray-600">
            Check the browser console (F12) to see detailed image loading logs.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ImageTest 