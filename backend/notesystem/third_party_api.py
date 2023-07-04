import os
from dotenv import load_dotenv
load_dotenv()

# 註解：
# 我目前還不需要用到私人的使用者資料，我所有需要訪問的都只是 public 在 youtube 上面的資訊，thumbnail 和 video title 而已
# 所以我會特別把一些與這次功能無關的用 @@ 標記起來


# @@ import google_auth_oauthlib.flow
import googleapiclient.discovery
import googleapiclient.errors

credentials = str(os.environ.get('KEY_YOUTUBE_DATA_API'))
print(credentials)

scopes = ["https://www.googleapis.com/auth/youtube.readonly"]

def get_youtube_json(video_id):
    # Disable OAuthlib's HTTPS verification when running locally.
    # *DO NOT* leave this option enabled in production.
    os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

    api_service_name = "youtube"
    api_version = "v3"
    # @@ client_secrets_file = "YOUR_CLIENT_SECRET_FILE.json"

    # @@ Get credentials and create an API client
    # @@ flow = google_auth_oauthlib.flow.InstalledAppFlow.from_client_secrets_file(
    # @@     client_secrets_file, scopes)
    # @@ credentials = flow.run_console()

    # 原本的 credential 不知道為什麼需要向 client 請求 json 檔案，在這邊，我是個 server 端，我只需要從 dotenv 裡面取出我事先申請好的 api_credential 去向 3rd api 發出 request 應該就可以了


    
    youtube = googleapiclient.discovery.build(
        api_service_name, api_version, developerKey=credentials)

    request = youtube.videos().list(
        part="snippet,contentDetails,statistics",
        id=video_id
    )
    response = request.execute()
    print(response)
    return(response)
    

# if __name__ == "__main__":
#     get_youtube_json()