import uuid
from django.core.files.storage import Storage
from supabase_client import supabase

class SupabaseStorage(Storage):
    bucket_name = "bms"

    def _save(self, name, content):
        # Keep the folder path from Django's upload_to
        folder = ''
        if '/' in name:
            folder, orig_name = name.rsplit('/', 1)
        else:
            orig_name = name

        ext = orig_name.split('.')[-1]
        unique_name = f"{uuid.uuid4()}.{ext}"

        # Prepend the folder from upload_to
        if folder:
            final_name = f"{folder}/{unique_name}"
        else:
            final_name = unique_name

        # Read content
        if hasattr(content, "read"):
            data = content.read()
        else:
            data = content

        # Upload to Supabase bucket
        supabase.storage.from_(self.bucket_name).upload(final_name, data)

        # Return path Django will store in model
        return final_name

    def exists(self, name):
        files = supabase.storage.from_(self.bucket_name).list()
        return any(f.get("name") == name for f in files)

    def delete(self, name):
        supabase.storage.from_(self.bucket_name).remove([name])

    def url(self, name):
        url_or_dict = supabase.storage.from_(self.bucket_name).get_public_url(name)
        if isinstance(url_or_dict, dict):
            return url_or_dict.get("publicUrl")
        return url_or_dict

    def _open(self, name, mode='rb'):
        data = supabase.storage.from_(self.bucket_name).download(name)
        from django.core.files.base import ContentFile
        return ContentFile(data)
