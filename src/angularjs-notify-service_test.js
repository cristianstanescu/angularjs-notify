describe('Notify', function () {
  var Notify;

  beforeEach(module('angularjsNotify'));

  beforeEach(function () {
    inject(function ($injector) {
      Notify = $injector.get('Notify');
    });
  });

  describe('addMessage', function () {
    describe('adds new messages to the list', function () {
      describe('when message argument is a string', function () {
        it('adds one new message', function () {
          Notify.addMessage("Success");
          expect(Notify.getMessages()[0].text).toEqual("Success");
        });
      });

      describe('when message argument is an object', function () {
        it('with one attribute with String value, one message', function () {
          Notify.addMessage({"email": "can't be blank"});
          expect(Notify.getMessages().length).toEqual(1);
        });

        it('with one attribute with array value, multiple messages', function () {
          Notify.addMessage({
            "email":["can't be blank", "is not an email"]
          });
          expect(Notify.getMessages().length).toEqual(2);
        });

        it('with multiple attributes, multiple messages', function () {
          Notify.addMessage({
            "email":["can't be blank", "is not an email"],
            "frequency":["is not a number", "is out of bounds"]
          });
          expect(Notify.getMessages().length).toEqual(4);
        });
      });

      it('as objects with "context", "text", "attribute"', function () {
        Notify.addMessage(
          {
            "email":["can't be blank", "is not an email"],
            "frequency": "is out of bounds"
          },
          'danger'
        );

        angular.forEach(Notify.getMessages(), function (message) {
          expect(message.hasOwnProperty('context')).toEqual(true);
          expect(message.hasOwnProperty('text')).toEqual(true);
          expect(message.hasOwnProperty('attribute')).toEqual(true);
        });
      });

      it('sets default context to "info" when none given', function () {
        Notify.addMessage({"email": "can't be blank"});

        expect(Notify.getMessages()[0].context).toEqual('info');
      });

      it('puts the attribute before the values as text built', function () {
        Notify.addMessage({"email": "can't be blank"});

        expect(Notify.getMessages()[0].text).toEqual("Email can't be blank");
      });
    });

    it('does not add keys that are configured to skip', function () {
      Notify.addMessage({"base": "this is a general error"});

      expect(Notify.getMessages()[0].text).toEqual("This is a general error");
    });

    it('removes underscores from the keys', function () {
      Notify.addMessage({"date_of_birth": "is not valid"});

      expect(Notify.getMessages()[0].text).
        toEqual("Date of birth is not valid");
    });
  });

  describe('danger', function () {
    it('adds an danger with "danger" context', function () {
      Notify.danger({"email": "can't be blank"});
      expect(Notify.getMessages()[0].context).toEqual('danger');
    });
  });

  describe('warning', function () {
    it('adds an warning with "warning" context', function () {
      Notify.warning({"email": "can't be blank"});
      expect(Notify.getMessages()[0].context).toEqual('warning');
    });
  });

  describe('info', function () {
    it('adds an info with "info" context', function () {
      Notify.info({"email": "can't be blank"});
      expect(Notify.getMessages()[0].context).toEqual('info');
    });
  });

  describe('success', function () {
    it('adds an success with "success" context', function () {
      Notify.success({"email": "can't be blank"});
      expect(Notify.getMessages()[0].context).toEqual('success');
    });
  });

  describe('getMessages', function () {
    it('only returns 10 maximum messages', function () {
      for (var i = 15 - 1; i >= 0; i--) {
        Notify.success({"email": "can't be blank"});
      }
      expect(Notify.getMessages().length).toEqual(10);
    });
  });
});
