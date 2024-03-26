export const handleFileUpdate = async (file: any) => {
  const { name } = file
  const objectKey = `${Date.now()}_${name}`
  await uploadFile(file, objectKey)
  return objectKey
}

export const uploadFile = async (file: any, objectKey: string, bucket?: string) => {
  const { data } = await useHttpPost({
    url: '/file/online-auth',
    body: {
      objectKey,
      size: 10,
      bucket: bucket || undefined
    }
  })
  console.log(data)
  if (!data) return
  const config = data.value

  const formData = new FormData()
  for (const key in config['formData']) {
    console.log(key, config['formData'][key])
    formData.append(key, config['formData'][key])
  }
  formData.append('file', file)

  console.log(formData.get('file'))

  await useFetch(config['postURL'], {
    method: 'post',
    body: formData
  })
}
