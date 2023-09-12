import argparse
import subprocess
import time
import threading
import pywikibot
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

url = "https://osrs-dev.weirdgloop.org/api.php"
filename = "MediaWiki:Gadget-wikisync-core.js"

parser = argparse.ArgumentParser()
subparsers = parser.add_subparsers(dest="command")
get_parser = subparsers.add_parser("get")
write_parser = subparsers.add_parser("write")
write_parser.add_argument("--username", required=True)
write_parser.add_argument("--watch", action="store_true")
write_parser.add_argument("--put_throttle", type=int, default=1)
args = parser.parse_args()

if args.command == "get":
    site = pywikibot.Site(url=url)
    page = pywikibot.Page(site, filename)
    print(page.text)
    with open(filename, "w") as f:
        f.write(page.text)

elif args.command == "write":
    pywikibot.config.put_throttle = args.put_throttle
    site = pywikibot.Site(url=url, user=args.username)
    page = pywikibot.Page(site, filename)

    def save_page():
        with open(filename, "r") as f:
            page.text = f.read()
        page.save("syncing latest version from file via API")

    save_page()

    if args.watch:

        def debounce(wait_time):
            """
            Decorator that will debounce a function so that it is called after wait_time seconds
            If it is called multiple times, will wait for the last call to be debounced and run only this one.
            """

            def decorator(function):
                def debounced(*args, **kwargs):
                    def call_function():
                        debounced._timer = None
                        return function(*args, **kwargs)

                    # if we already have a call to the function currently waiting to be executed, reset the timer
                    if debounced._timer is not None:
                        debounced._timer.cancel()

                    # after wait_time, call the function provided to the decorator with its arguments
                    debounced._timer = threading.Timer(wait_time, call_function)
                    debounced._timer.start()

                debounced._timer = None
                return debounced

            return decorator

        class EventHandler(FileSystemEventHandler):
            @debounce(args.put_throttle)
            def on_modified(self, event):
                print(time.time())
                save_page()

        event_handler = EventHandler()
        observer = Observer()
        observer.schedule(event_handler, filename)
        observer.start()
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            observer.stop()
        observer.join()

else:
    parser.print_help()
